import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import connectDb from "../config/db.js";


// Load environment variables
dotenv.config();

const migrateFeatures = async () => {
  try {
    await connectDb();
    console.log("MongoDB Connected ✅");

    // Load JSON file
    const filePath = path.join(path.resolve(), "..", "model_training", "merged_features.json");
    const rawData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(rawData);

    const products = Object.entries(jsonData).map(([image, data]) => ({
      image:data.image,
      features: data.features,
      title: data.title,
      price: data.price,
      rating: data.rating,
      stock: data.stock,
      category: data.category,
      votes: data.votes,
      brand: data.brand,
      description: data.description,

    }));

    await Product.insertMany(products);
    console.log("Data migrated successfully");

    process.exit(0);
  } catch (err) {
    console.error("Migration failed ❌", err);
    process.exit(1);
  }
};

migrateFeatures();
