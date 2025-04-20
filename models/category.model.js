import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    filters: {
      material: [{ type: String }], 
      priceRange: { min: Number, max: Number },
      occasion: [{ type: String }], 
    }
  }, { timestamps: true });
  
const category = mongoose.model("category", CategorySchema)
export default category;