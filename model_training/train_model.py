import tensorflow as tf
import numpy as np
import os
import json
import pandas as pd
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array, load_img

model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
IMAGE_FOLDER = "data"
CSV_PATH = "products.csv"

df = pd.read_csv(CSV_PATH)
features = {}

for index, row in df.iterrows():
    product_id = str(index + 1)
    image_path = os.path.join(IMAGE_FOLDER, f"{product_id}.jpg")

    if os.path.exists(image_path):
        try:
            img = load_img(image_path, target_size=(224, 224))
            img_array = img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)
            feature_vector = model.predict(img_array).flatten()

            features[f"{product_id}.jpg"] = {
                "features": feature_vector.tolist(),
                "title": row.get("Title", ""),
                "price": row.get("Price", ""),
                "rating": row.get("Rating", ""),
                "description": row.get("Description", ""),
                "stock": row.get("Stock", ""),
                "category": row.get("Category", ""),
                "votes": row.get("Votes", ""),
                "brand": row.get("Brand", "")
            }

            print(f"{product_id}.jpg -> Title: {row.get('Title', '')}, Price: {row.get('Price', '')}, Rating: {row.get('Rating', '')}, Stock: {row.get('Stock', '')}, Description: {row.get('Description', '')}, Category: {row.get('Category', '')}, Votes: {row.get('Votes', '')},Brand: {row.get('Brand', '')}")

        except Exception as e:
            print(f"Error processing {product_id}.jpg: {e}")

with open("product_features.json", "w") as f:
    json.dump(features, f)

print("Training complete. Features and metadata saved.")
