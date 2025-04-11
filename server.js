// Import required modules
import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js'; // Database connection
import path from 'path';
import { fileURLToPath } from 'url';


// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Routes
import routes from './router/router.js';

// Initialize Express app
const app = express();


// Connect to the database with error handling
(async () => {
  try {
    await connectDb();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop the server if DB connection fails
  }
})();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  // process.env.CLIENT_URL, 
];

// Use CORS middleware with dynamic origin handling
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Add Vary header to prevent caching issues in multi-origin environments
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// Serve static files (images) from model_training/data
app.use('/images', express.static(path.join(__dirname, './model_training/data')));


app.use(express.json());

// Add routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
