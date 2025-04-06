import Product from "../../models/product.model.js";
import fs from 'fs';
import path from 'path';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductFeatures = (req, res) => {
  const filePath = path.join(__dirname, '../model_training/product_features.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading product features:', err);
      return res.status(500).json({ error: 'Failed to read feature file' });
    }
    res.json(JSON.parse(data));
  });
};
