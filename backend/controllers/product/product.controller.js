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




// controller to fetch the products using search bar
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// for filters
export const getFilters = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    const categories = await Product.distinct("category");

    // Get min and max price dynamically
    const prices = await Product.find().select("price -_id");
    const allPrices = prices.map(p => p.price);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    // Generate ranges dynamically (e.g., every ₹500)
    const step = 5000;
    const priceRanges = [];
    for (let start = Math.floor(minPrice / step) * step; start < maxPrice; start += step) {
      const end = start + step;
      priceRanges.push({
        label: `₹${start} - ₹${end}`,
        value: `${start}-${end}`
      });
    }

    res.json({ brands, categories, priceRanges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
