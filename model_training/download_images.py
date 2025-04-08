import pandas as pd
import os
import requests
from PIL import Image
from io import BytesIO

# Enable cropping and resizing
CROP_AND_RESIZE = True
TARGET_SIZE = (300, 300)  # Width x Height

df = pd.read_csv("products.csv")
os.makedirs("data", exist_ok=True)

def crop_and_resize(image):
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    right = left + side
    bottom = top + side
    cropped = image.crop((left, top, right, bottom))
    return cropped.resize(TARGET_SIZE, Image.LANCZOS)

for _, row in df.iterrows():
    url = row["Image URL"]
    sno = row.get("SNO")

    if pd.isna(sno):
        print(f"Skipping: Missing SNO for URL {url}")
        continue

    img_name = f"data/{int(sno)}.jpg"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            if CROP_AND_RESIZE:
                img = crop_and_resize(img)

            img.save(img_name, "JPEG", quality=90)
            print(f"Downloaded: {img_name}")
        else:
            print(f"Failed to download (status {response.status_code}): {url}")
    except Exception as e:
        print(f"Error with {url}: {e}")
