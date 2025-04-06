import json
import os

# Load features.json
with open("product_features.json", "r") as f:
    features_data = json.load(f)

# Load Cloudinary URLs
with open("cloudinary_urls.json", "r") as f:
    urls_data = json.load(f)

# Convert URL list to dict for faster lookup
url_map = {entry["filename"]: entry["url"] for entry in urls_data}

# Merge URLs into features
merged_data = {}
for filename, data in features_data.items():
    if filename in url_map:
        data["image"] = url_map[filename]
    else:
        data["image"] = None  # or handle missing case
    merged_data[filename] = data

# Save merged output
with open("merged_features.json", "w") as f:
    json.dump(merged_data, f, indent=2)

print("✅ Merged features saved to merged_features.json")
