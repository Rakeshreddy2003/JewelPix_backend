import Product from "../../models/product.model.js";

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    // If price is stored as string, convert to number first
    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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


// Utility to format numbers like 100000 to 1L, 200000 to 2L, etc.
const formatToLakh = (num) => {
  return num >= 100000 ? `${num / 100000}L` : `₹${num.toLocaleString()}`;
};

export const getFilters = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    const categories = await Product.distinct("category");

    const prices = await Product.find().select("price -_id");
    const allPrices = prices.map(p => p.price);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const step = 100000;
    const priceRanges = [];
    for (let start = Math.floor(minPrice / step) * step; start < maxPrice; start += step) {
      const end = start + step;
      priceRanges.push({
        label: `${formatToLakh(start)} - ${formatToLakh(end)}`,
        value: `${start}-${end}`
      });
    }

    res.json({ brands, categories, priceRanges });
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


