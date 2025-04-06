import Wishlist from "../../models/wishList.model.js";

// Get User Wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("items.productId");
    if (!wishlist) return res.status(200).json({ items: [] });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Product to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) wishlist = new Wishlist({ userId: req.user.id, items: [] });

    const { productId } = req.body;
    if (!wishlist.items.some(item => item.productId.toString() === productId)) {
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Product from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
