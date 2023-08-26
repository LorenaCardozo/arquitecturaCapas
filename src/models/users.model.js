import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: false, max: 100 },
});

const User = mongoose.model(userCollection, userSchema);

export default User;