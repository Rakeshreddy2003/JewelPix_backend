import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 }
    }],
    totalPrice: { type: Number, required: true, default: 0 },
  }, { timestamps: true });
  
const cart = mongoose.model("cart", CartSchema)
export default cart;