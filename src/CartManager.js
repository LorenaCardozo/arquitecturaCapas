import { fileURLToPath } from "url";
import { dirname } from "path";
import { FileManager } from './class/FileManager.js';
import { ProductManager } from './ProductManager.js';

class Cart {
    ID;
    products;

    constructor(id) {
        this.ID = id;
        this.products = [];
    }
}

export class CartManager {
    carts;
    static ultID = 0;

    constructor(path) {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        this.path = __dirname + '/' + path
        this.carts = [];
    }

    /********  CLASS -- CART ***************/

    async addCart() {

        let carritos = await FileManager.readFile(this.path);

        this.carts = carritos?.length > 0 ? carritos : []
        CartManager.ultID = carritos.reduce((max, cart) => { if (cart.ID > max) { return cart.ID; } return max; }, 0);

        CartManager.ultID++;
        const cart = new Cart(CartManager.ultID);

        this.carts.push(cart);

        //escribo el archivo

        try {
            await FileManager.writeFile(this.path, this.carts);
            return "Se agregó un nuevo carrito."
        } catch (error) {
            console.log(error);
        }

    }

    async getCartById(id) {

        try {
            let carritos = await FileManager.readFile(this.path);
            this.carts = carritos?.length > 0 ? carritos : []

            const cart = this.carts.find((p) => p.ID === id)

            if (cart !== undefined) {
                return cart.products;
            } else {
                return "no se encontró el carrito";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async addProductInCart(idCart, idProduct) {

        try {
            let carritos = await FileManager.readFile(this.path);
            this.carts = carritos?.length > 0 ? carritos : []

            const cart = this.carts.find((p) => p.ID === idCart)

            if (cart !== undefined) {

                const prodInCart = cart.products.find((pr) => pr.product === idProduct)

                if (prodInCart !== undefined) {
                    //SI YA EXISTE EL PRODUCTO EN EL CARRITO SUMO LA CANTIDAD
                    prodInCart.quantity++
//                    cart.products.push({ product: prod.ID, quantity: 1 })
                } else {
                    // SI EL PRODUCTO NO ESTA EN EL CARRITO COMPRUEBO Q EL PRODUCTO SEA VÁLIDO
                    const cm = new ProductManager("productos.json");
                    let productos = await cm.getProducts();

                    const prod = productos.find((p) => p.ID === idProduct)

                    if (prod !== undefined) {
                        // SI EL PRODUCTO ES VALIDO LO AGREGO AL CARRITO
                        cart.products.push({ product: prod.ID, quantity: 1 })
                    }
                    else {
                        return "el producto no existe"
                    }
                }

                //ACTUALIZO EL ARCHIVO DE CARRITOS
                try {
                    await FileManager.writeFile(this.path, this.carts);
                    return "Se agregó el producto al carrito."
                } catch (error) {
                    console.log(error);
                }

            } else {
                return "no se encontró el carrito";
            }

        } catch (error) {
            console.log(error);
        }

    }


}

export default {
    CartManager
};