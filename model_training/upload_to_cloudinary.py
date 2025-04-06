import os
import json
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

# Load environment variables
load_dotenv()

env_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path=env_path)


# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Path to local images folder
IMAGE_FOLDER = "./data"

# Store uploaded URLs
uploaded_urls = []

# Upload all images in the folder
for filename in os.listdir(IMAGE_FOLDER):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        image_path = os.path.join(IMAGE_FOLDER, filename)
        result = cloudinary.uploader.upload(image_path, folder="jewelpix")
        uploaded_urls.append({
            "filename": filename,
            "url": result["secure_url"]
        })
        print(f"✅ Uploaded: {filename} → {result['secure_url']}")

# Save all URLs to JSON file
with open("cloudinary_urls.json", "w") as f:
    json.dump(uploaded_urls, f, indent=2)
