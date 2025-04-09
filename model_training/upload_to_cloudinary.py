import os
import json
import time
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path=env_path)

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

IMAGE_FOLDER = "./data"
uploaded_urls = []
failed_uploads = []

for filename in sorted(os.listdir(IMAGE_FOLDER)):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        image_path = os.path.join(IMAGE_FOLDER, filename)
        
        if not os.path.exists(image_path):
            print(f"❌ Skipped (not found): {filename}")
            continue

        try:
            result = cloudinary.uploader.upload(image_path, folder="JewelleryPixImages")
            uploaded_urls.append({
                "filename": filename,
                "url": result["secure_url"]
            })
            print(f"✅ Uploaded: {filename} → {result['secure_url']}")
        except Exception as e:
            print(f"❌ Failed: {filename} → {str(e)}")
            failed_uploads.append(filename)
        
        time.sleep(1)  # optional delay

# Save successful uploads
with open("cloudinary_urls.json", "w") as f:
    json.dump(uploaded_urls, f, indent=2)

# Save failed uploads (if any)
if failed_uploads:
    with open("failed_uploads.json", "w") as f:
        json.dump(failed_uploads, f, indent=2)
    print(f"\n❗ Some uploads failed. See failed_uploads.json")
