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
import traceback
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load env from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path=env_path)

def load_model():
    return MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

def extract_features(image_path, model):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    feature_vector = model.predict(img_array, verbose=0).flatten()
    return feature_vector.tolist()

def find_similar(image_path, model, top_n=5):
    uploaded_features = extract_features(image_path, model)

    mongo_uri = os.getenv("MONGODB_CONNECTION_STRING")
    if not mongo_uri:
        raise ValueError("MongoDB URI not found in .env")

    client = MongoClient(mongo_uri)
    db = client["JewelPix"]
    collection = db["products"]

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
    try:
        if len(sys.argv) < 2:
            raise ValueError("No image path provided")

        image_path = sys.argv[1]
        model = load_model()
        results = find_similar(image_path, model)

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

        sys.stdout.write(json.dumps(formatted) + "\n")
        sys.stdout.flush()


    except Exception as e:
        error_output = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_output))
        sys.exit(1)

    finally:
        if 'image_path' in locals() and os.path.exists(image_path):
            os.remove(image_path)
