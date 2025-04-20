//to store user data 

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  userImage: { type: String }, 
}, { timestamps: true });


const user = mongoose.model('user', userSchema);
export default user;
