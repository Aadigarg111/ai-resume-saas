from flask_pymongo import PyMongo
from pymongo import MongoClient
import os

# MongoDB connection string
MONGODB_URI = "mongodb+srv://aadileetcode:3PyPy3AbgYSbTtrZ@cluster0.ppfyozj.mongodb.net/"

mongo = PyMongo()

def init_db(app):
    """Initialize MongoDB connection with Flask app"""
    app.config["MONGO_URI"] = MONGODB_URI
    mongo.init_app(app)
    return mongo

def get_db():
    """Get database instance"""
    return mongo.db

def get_collection(collection_name):
    """Get specific collection"""
    return mongo.db[collection_name]

