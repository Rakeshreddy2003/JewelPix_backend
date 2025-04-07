import os
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from dotenv import load_dotenv

# Suppress TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load env from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path=env_path)

# Load model
model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

# MongoDB setup
mongo_uri = os.getenv("MONGODB_CONNECTION_STRING")
if not mongo_uri:
    print(json.dumps({"error": "MongoDB URI not found in .env"}))
    sys.exit(1)

client = MongoClient(mongo_uri)
db = client["JewelPix"]
collection = db["products"]

def extract_features(image_path):
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    feature_vector = model.predict(img_array, verbose=0).flatten()
    return feature_vector.tolist()  # Ensure it's serializable

def find_similar(image_path, top_n=5):
    uploaded_features = extract_features(image_path)

    similarities = []
    cursor = collection.find({}, {
        "image": 1,
        "features": 1,
        "title": 1,
        "price": 1,
        "rating": 1,
        "stock": 1,
        "description": 1,
        "category": 1,
        "votes": 1,
        "brand": 1,
    })

    for doc in cursor:
        if "features" not in doc or not isinstance(doc["features"], list):
            continue
        similarity = cosine_similarity([uploaded_features], [doc["features"]])[0][0]
        similarities.append((doc["image"], similarity, doc))

    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_n]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        results = find_similar(image_path)

        formatted = [
            {
                "image": meta.get("image"),
                "title": meta.get("title"),
                "price": meta.get("price"),
                "rating": meta.get("rating"),
                "stock": meta.get("stock"),
                "category": meta.get("category", ""),
                "votes": meta.get("votes", ""),
                "brand": meta.get("brand", ""),
                "description": meta.get("description", "").replace("\n", " ").strip()
            }
            for img, sim, meta in results
        ]

        # ✅ ONLY print JSON
         print(json.dumps(formatted_results))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
