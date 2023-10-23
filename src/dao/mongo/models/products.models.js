import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importa el módulo

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    owner: {type: String, default: 'admin'}, 
})
productSchema.plugin(mongoosePaginate); // Aplica el plugin de paginación

const ProductModel = mongoose.model(productsCollection, productSchema);

export default ProductModel;