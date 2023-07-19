import { fileURLToPath } from "url";
import { dirname } from "path";
import { FileManager } from './classes/FileManager.js';
import { stat } from "fs";

/********  CLASS -- PRODUCTO ***************/

class Producto {
    ID;
    title;
    description;
    code;    
    price;
    status;    
    stock;
    category;
    thumbnail;

    constructor(id, title, description, price, thumbnail, code, stock, category) {
        this.ID = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = true;
        this.category = category;
    }

    camposCompletos() {
        if (this.ID === '' || this.ID === 'undefined' ||
            this.title === '' || this.title === 'undefined' ||
            this.description === '' || this.description === 'undefined' ||
            this.price === '' || this.price === 'undefined' ||
            this.thumbnail === '' || this.thumbnail === 'undefined' ||
            this.code === '' || this.code === 'undefined' ||
            this.stock === '' || this.stock === 'undefined' || 
            this.category === '' || this.category === 'undefined'
        ) {
            return false;
        }

        return true;

    }
}


/********  CLASS -- PRODUCT MANAGER ***************/

export class ProductManager {
    products;
    static ultID = 0;

    constructor(path) {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        this.path = __dirname + '/' + path
        this.products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock, category, status) {

        status = (status === 'undefined' || status === '')?true: status;

        let productos = await FileManager.readFile(this.path);

        this.products = productos?.length > 0 ? productos : []
        ProductManager.ultID = productos.reduce((max, producto) => {if (producto.ID > max) {return producto.ID;} return max; }, 0);

        if (this.products.some((p) => p.code === code)) {
            return `Ya existe un producto con el Code ${code}`
        }

        ProductManager.ultID++;
        const prod = new Producto(ProductManager.ultID, title, description, price, thumbnail, code, stock);

        if (prod.camposCompletos()) {
            this.products.push(prod);
        }
        else {
            console.log('Debe completar todos los campos del producto')
        }

        //escribo el archivo

        try {
            await FileManager.writeFile(this.path, this.products);
            return "Producto agregado."
        } catch (error) {
            console.log(error);
        }

    }

    async getProducts() {
        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            return productos?.length > 0 ? productos : [];
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const product = this.products.find((p) => p.ID === id)

            if (product !== undefined) {
                return product;
            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async updateProduct(id, datos) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const index = this.products.findIndex((p) => p.ID === id)

            if (index != -1) {
                delete datos.ID;

                this.products[index] = {
                    ...this.products[index],
                    ...datos,
                };

                await FileManager.writeFile(this.path, this.products);

                return "Se modificó el producto"

            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async deleteProduct(id, datos) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const index = this.products.findIndex((p) => p.ID === id)

            if (index != -1) {
                let product = this.products[index];
                this.products.splice(index, 1);

                await FileManager.writeFile(this.path, this.products);

                return "Se eliminó el producto."

            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async deleteProductByCode(code) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const index = this.products.findIndex((p) => p.code === code)

            if (index != -1) {
                let product = this.products[index];
                this.products.splice(index, 1);

                await FileManager.writeFile(this.path, this.products);

                return "Se eliminó el producto."

            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }


}

export default {
    ProductManager
};

/*PRUEBA*/
/****************************************************/

/*
const pm = new ProductManager('./Productos.js');

pm.getProducts().then((p) => console.log(p))

pm.addProduct('producto prueba', 'Este es un producto prueba', 200, 'sin imagen', 'abc123', 25)
    .then(() => pm.getProducts().then((p) => console.log(p)))

*/

/****************************************************/

