import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const findSimilarProducts = (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = path.resolve(req.file.path); // ✅ Absolute path
  const scriptPath = path.resolve(__dirname, "../../../model_training/find_similar.py");

  const command = `python "${scriptPath}" "${imagePath}"`;
  console.log("Running command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python error:", error.message);
      return res.status(500).json({ error: "Error processing image" });
    }
  
    console.log("🟢 Raw Python stdout:\n", stdout);
  
    try {
      // Match JSON array from anywhere inside messy stdout
      const jsonMatch = stdout.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON array found");
      }
  
      const jsonString = jsonMatch[0];
      const result = JSON.parse(jsonString);
  
      console.log("data fetched successfully" );
      res.json({ results: result });
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      res.status(500).json({ error: "Invalid response from model" });
    }
  });
  
  
};
