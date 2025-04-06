import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  image: { type: String }, 
  features: [{ type: Number }], 
  title: { type: String, required: true },
  price: { type: String, required: true },
  rating: { type: Number },
  stock: { type: String, required: true }, 
  description: { type: String },
});

const Products = mongoose.model("Product", ProductSchema);
export default Products;
