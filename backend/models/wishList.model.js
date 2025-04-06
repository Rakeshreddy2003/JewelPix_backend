import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Wishlist = mongoose.model("wishlist", WishlistSchema);
export default Wishlist;
