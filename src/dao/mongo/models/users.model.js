import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  
  first_name: {type: String, max: 100},
  last_name: {type: String, max: 100},
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value > 0; // Validar que age sea mayor que 0
      },
      message: 'La edad debe ser mayor que 0.'
    }
  },
  username: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true},
  password: { type: String, required: false, max: 100 },
  role: {type: String, default: 'user'},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'CartModel' } // Referencia a un carrito único por usuario
  
});

const User = mongoose.model(userCollection, userSchema);

export default User;