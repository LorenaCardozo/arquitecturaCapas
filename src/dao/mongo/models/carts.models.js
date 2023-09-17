import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        quantity: Number,
    }]
});

import ProductModel from "../models/products.models.js"; 
cartSchema.path('products.productId').ref(ProductModel);

const CartModel = mongoose.model(cartCollection, cartSchema);

export default CartModel;