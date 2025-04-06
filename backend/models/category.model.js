import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    filters: {
      material: [{ type: String }], // Example: Gold, Silver, Platinum
      priceRange: { min: Number, max: Number },
      occasion: [{ type: String }], // Example: Wedding, Party, Daily Wear
    }
  }, { timestamps: true });
  
const category = mongoose.model("category", CategorySchema)
export default category;