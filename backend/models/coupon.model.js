import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });
  
const coupon = mongoose.model("coupon", CouponSchema)
export default coupon;