import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const findSimilarProducts = (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = path.resolve(req.file.path);
  const scriptPath = path.resolve(__dirname, "../../model_training/find_similar.py");
  const pythonCmd = process.env.NODE_ENV === "production" ? "python3" : "python";
  const command = `${pythonCmd} "${scriptPath}" "${imagePath}"`;
  

  console.log("Running command:", command);
  
  exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
    console.log("stdout:", stdout);
    console.error("stderr:", stderr);
  
    if (error) {
      console.error("Python error:", error.message);
      return res.status(500).json({ error: "Error processing image" });
    }
  
    try {
      const jsonMatch = stdout.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) throw new Error("No valid JSON array found");
  
      const result = JSON.parse(jsonMatch[0]);
      res.json({ results: result });
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({ error: "Invalid response from model" });
    }
  });
  
};
