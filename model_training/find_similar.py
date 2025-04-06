# import tensorflow as tf
# import numpy as np
# import json
# import os
# import sys
# from tensorflow.keras.applications import MobileNetV2
# from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
# from tensorflow.keras.preprocessing.image import img_to_array, load_img
# from sklearn.metrics.pairwise import cosine_similarity

# # Suppress TF logs
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# # Load model
# model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

# # Load features
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FEATURE_PATH = os.path.join(BASE_DIR, "product_features.json")

# with open(FEATURE_PATH, "r") as f:
#     features = json.load(f)

# def extract_features(image_path):
#     img = load_img(image_path, target_size=(224, 224))
#     img_array = img_to_array(img)
#     img_array = np.expand_dims(img_array, axis=0)
#     img_array = preprocess_input(img_array)
#     feature_vector = model.predict(img_array, verbose=0).flatten()
#     return feature_vector

# def find_similar(image_path, top_n=5):
#     uploaded_features = extract_features(image_path)

#     similarities = []
#     for img_name, data in features.items():
#         similarity = cosine_similarity([uploaded_features], [data["features"]])[0][0]
#         similarities.append((img_name, similarity, data))

#     similarities.sort(key=lambda x: x[1], reverse=True)
#     return similarities[:top_n]

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({ "error": "No image path provided" }, indent=2))
#         sys.exit(1)

#     image_path = sys.argv[1]

#     try:
#         results = find_similar(image_path)

#         formatted_results = [
#             {
#                 "image": img,
#                 "title": meta["title"],
#                 "price": meta["price"],
#                 "rating": meta["rating"],
#                 "stock": meta["stock"],
#                 "description": meta["description"].replace("\n", " ").strip()
#             }
#             for img, score, meta in results
#         ]

#         # ✅ Print pretty JSON
#         print(json.dumps(formatted_results, indent=2))

#     except Exception as e:
#         print(json.dumps({ "error": str(e) }, indent=2))
#         sys.exit(1)


import tensorflow as tf
import numpy as np
import json
import os
import sys
import pymongo
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from dotenv import load_dotenv
import os



# Load environment from ../backend/.env
env_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path=env_path)

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load model
model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

mongo_uri = os.getenv("MONGODB_CONNECTION_STRING")
if not mongo_uri:
    raise Exception("MONGODB_URI not found in .env")


# MongoDB setup
client = MongoClient(mongo_uri)
db = client["JewelPix"]
collection = db["products"]


def extract_features(image_path):
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    feature_vector = model.predict(img_array, verbose=0).flatten()
    return feature_vector

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
        "description": 1
    })

    for doc in cursor:
        similarity = cosine_similarity([uploaded_features], [doc["features"]])[0][0]
        similarities.append((doc["image"], similarity, doc))

    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_n]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({ "error": "No image path provided" }, indent=2))
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        results = find_similar(image_path)

        formatted_results = [
            {
                "image": meta.get("image"),
                "title": meta.get("title"),
                "price": meta.get("price"),
                "rating": meta.get("rating"),
                "stock": meta.get("stock"),
                "description": meta.get("description", "").replace("\n", " ").strip()
            }
            for img, score, meta in results
        ]

        print(json.dumps(formatted_results, indent=2))

    except Exception as e:
        print(json.dumps({ "error": str(e) }, indent=2))
        sys.exit(1)

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
