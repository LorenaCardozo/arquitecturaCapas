import cartModel from "./mongo/models/carts.models.js";
import Products from "./products.dao.js";

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
        const respuesta = await cartModel.find({ _id: id }).populate('products.productId').lean();
        return respuesta;
    }

    async delete(cid, pid) {
        //const respuesta= nothing;
        let cart = await cartModel.findOne({ _id: cid }).lean()
        let products = cart.products

        let indexProd = products.findIndex((p) => p.productId.toString() === pid)

        if (indexProd !== -1) {
            products.splice(indexProd, 1)

            return  await cartModel.findByIdAndUpdate(cid, cart)
        }else{
            return -1
        }
    };

    async update (cid, data){
        let cart = await cartModel.findById(cid)
        cart.products = data

        let result = await cartModel.findByIdAndUpdate(cid,cart)
        return result;         
    };

    async updateQuantity (cid, pid, quantity){

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

    async EmptyCart(cid){

        let cart = await cartModel.findById(cid).lean();
        cart.products = [];
        let result = await cartModel.findByIdAndUpdate(cid,cart)
        
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



}