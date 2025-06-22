from flask_pymongo import PyMongo
from pymongo import MongoClient
import os

mongo = PyMongo()

def get_db():
    """Get database instance"""
    return mongo.db

def get_collection(collection_name):
    """Get specific collection"""
    return mongo.db[collection_name]


