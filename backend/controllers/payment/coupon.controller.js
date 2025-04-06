import Coupon from "../../models/coupon.model.js";

export const applyCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.body.code, isActive: true });
    if (!coupon || new Date() > coupon.expiryDate) 
      return res.status(400).json({ message: "Invalid or expired coupon" });

    res.json({ discount: coupon.discountValue, type: coupon.discountType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
