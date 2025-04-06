import pandas as pd
import os
import requests
from PIL import Image
from io import BytesIO

# Load CSV file
df = pd.read_csv("products.csv")

# Create a folder to save images
os.makedirs("data", exist_ok=True)

for index, row in df.iterrows():
    url = row["Image URL"]
    img_name = f"data/{index}.jpg"  # Use index or a unique identifier for the image name

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            img.save(img_name)
            print(f"Downloaded: {img_name}")
        else:
            print(f"Failed to download: {url}")
    except Exception as e:
        print(f"Error with {url}: {e}")
