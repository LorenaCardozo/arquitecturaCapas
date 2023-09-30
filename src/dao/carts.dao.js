import { json } from "express";
import cartModel from "./mongo/models/carts.models.js";
import Products from "./products.dao.js";
import ticketModel from './mongo/models/tickets.models.js';
import { enviarCorreo } from "../utils.js";


const products = new Products();

export default class Carts {

    async getAll() {
        let respuesta = await cartModel.find();
        return respuesta;
    }

    async save(data) {
        const respuesta = await cartModel.create(data);
        return respuesta;
    }

    async update(id, data) {
        const respuesta = await cartModel.findByIdAndUpdate(id, data);
        return respuesta;
    }

    async getById(id) {
        //const respuesta = await cartModel.find({ _id: id }).populate('products.productId').lean();
        const respuesta = await cartModel
            .find({ _id: id })
            .populate('products.productId') // Aquí especificamos el campo y, opcionalmente, excluimos el campo _id
            .lean(); // Usamos exec() para ejecutar la consulta

        console.log(JSON.stringify(respuesta));
        return respuesta;
    }

    async delete(cid, pid) {
        //const respuesta= nothing;
        let cart = await cartModel.findOne({ _id: cid }).lean()
        let products = cart.products

        let indexProd = products.findIndex((p) => p.productId.toString() === pid)

        if (indexProd !== -1) {
            products.splice(indexProd, 1)

            return await cartModel.findByIdAndUpdate(cid, cart)
        } else {
            return -1
        }
    };

    async update(cid, data) {
        let cart = await cartModel.findById(cid)
        cart.products = data

        let result = await cartModel.findByIdAndUpdate(cid, cart)
        return result;
    };

    async updateQuantity(cid, pid, quantity) {

        let cart = await cartModel.findOne({ _id: cid }).lean();
        let products = cart.products

        let indexProd = products.findIndex((p) => p.productId.toString() === pid)

        if (indexProd !== -1) {
            products[indexProd].quantity = quantity

            let result = await cartModel.findByIdAndUpdate(cid, cart)
            return result;
        } else {
            return -1;
        }
    };

    async EmptyCart(cid) {

        let cart = await cartModel.findById(cid).lean();
        cart.products = [];
        let result = await cartModel.findByIdAndUpdate(cid, cart)

        return result
    }


    async addProductToCart(cid, pid) {
        /* traigo el carrito con el ID buscado */
        const cart = await cartModel.findOne({ _id: cid });

        if (!cart) {
            return { message: "El carrito no existe" };
        }

        /* chequeo si dentro del carrito hay un producto con el pid igual */

        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid)

        if (productIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementar la cantidad
            cart.products[productIndex].quantity++;

            await cartModel.findByIdAndUpdate(cid, cart)
            const response = await cartModel.findById(cid)
            return response
        } else {
            // SI EL PRODUCTO NO ESTA EN EL CARRITO COMPRUEBO Q EL PRODUCTO SEA VÁLIDO
            let prod = await products.getById(pid);
            if (prod !== undefined) {
                // SI EL PRODUCTO ES VALIDO LO AGREGO AL CARRITO
                cart.products.push({ productId: pid, quantity: 1 });

                await cartModel.findByIdAndUpdate(cid, cart)
                const response = await cartModel.findById(cid)
                return response
            }
            else {
                return "el producto no existe"
            }
        }
    };


    async FinalizarCompra(cid, email) {
        // Trae el carrito con el ID buscado
        const cart = await cartModel.findOne({ _id: cid });

        if (!cart) {
            return { message: "El carrito no existe" };
        }

        let TotalCompra = 0;
        // Verifica si dentro del carrito hay productos con stock suficiente
        const productosConStockInsuficiente = [];
        const productsCompra = [];
        for (const product of cart.products) {
            const prod = await products.getById(product.productId);
            if (!prod || prod[0].stock < product.quantity) {
                productosConStockInsuficiente.push({title:prod[0].title, quantity: product.quantity});
            } else {
                TotalCompra += product.quantity * prod[0].price;
                productsCompra.push({productName: prod[0].title, quantity: product.quantity, unitPrice:prod[0].price, total: product.quantity * prod[0].price})

            }

        }

        await this.update(cid, productsCompra)

        // Si todos los productos tienen suficiente stock, crea un nuevo ticket
        const ticketData = {
            // Define los datos del ticket según el modelo
            amount: TotalCompra,
            purchaser: email,
        };

        // Crea el ticket en la base de datos
        const nuevoTicket = await ticketModel.create(ticketData);

        enviarCorreo(email, "Gracias por tu compra!!", "Tu pedido ya ha sido procesado.")

        return {
            message: "Compra exitosa, se ha generado un ticket",
            ticket: nuevoTicket, 
            productosSinStock: productosConStockInsuficiente,
            products: productsCompra,
        };

    }




}