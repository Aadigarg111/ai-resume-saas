from flask_pymongo import PyMongo
from pymongo import MongoClient
import os

# MongoDB connection string
MONGODB_URI = "mongodb+srv://aadileetcode:3PyPy3AbgYSbTtrZ@cluster0.ppfyozj.mongodb.net/"

mongo = PyMongo()

def init_db(app):
    """Initialize MongoDB connection with Flask app"""
    app.config["MONGO_URI"] = MONGODB_URI
    try:
        mongo.init_app(app)
        # Attempt to access a collection to force connection and check status
        with app.app_context():
            mongo.db.command("ping")
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        # Optionally re-raise the exception if you want the app to fail on connection error
        # raise
    return mongo

def get_db():
    """Get database instance"""
    return mongo.db

def get_collection(collection_name):
    """Get specific collection"""
    return mongo.db[collection_name]


