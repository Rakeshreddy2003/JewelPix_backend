import mongoose from "mongoose";

const AISearchSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    extractedFeatures: [{ type: Number, required: true }], // AI-generated feature vector
    matchedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

const aiSearch = mongoose.model("aiSearch", AISearchSchema)
export default aiSearch;