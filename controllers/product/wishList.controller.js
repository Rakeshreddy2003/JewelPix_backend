import Wishlist from "../../models/wishList.model.js";
import Product from "../../models/product.model.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("items.productId");
    if (!wishlist) return res.json({ items: [] });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ userId: req.user._id, items: [] });

    const exists = wishlist.items.some(item => item.productId.equals(productId));
    if (exists) return res.status(400).json({ message: "Product already in wishlist" });

    wishlist.items.push({ productId });
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(item => !item.productId.equals(productId));
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
