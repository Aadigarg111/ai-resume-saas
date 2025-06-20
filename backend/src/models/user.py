from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from src.database.config import get_collection

class User:
    def __init__(self, username=None, email=None, password=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password) if password else None
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    @staticmethod
    def get_collection():
        return get_collection('users')
    
    def save(self):
        """Save user to database"""
        user_data = self.to_dict()
        if self._id:
            # Update existing user
            user_data['updated_at'] = datetime.utcnow()
            self.get_collection().update_one(
                {'_id': ObjectId(self._id)}, 
                {'$set': user_data}
            )
        else:
            # Create new user
            result = self.get_collection().insert_one(user_data)
            self._id = str(result.inserted_id)
        return self
    
    @classmethod
    def find_by_email(cls, email):
        """Find user by email"""
        user_data = cls.get_collection().find_one({'email': email})
        if user_data:
            return cls.from_dict(user_data)
        return None
    
    @classmethod
    def find_by_id(cls, user_id):
        """Find user by ID"""
        try:
            user_data = cls.get_collection().find_one({'_id': ObjectId(user_id)})
            if user_data:
                return cls.from_dict(user_data)
        except:
            pass
        return None
    
    @classmethod
    def find_by_username(cls, username):
        """Find user by username"""
        user_data = cls.get_collection().find_one({'username': username})
        if user_data:
            return cls.from_dict(user_data)
        return None
    
    def check_password(self, password):
        """Check if password matches"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def to_json(self):
        """Convert user to JSON-serializable format"""
        return {
            'id': str(self._id),
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create user from dictionary"""
        user = cls()
        user._id = str(data['_id'])
        user.username = data.get('username')
        user.email = data.get('email')
        user.password_hash = data.get('password_hash')
        user.created_at = data.get('created_at')
        user.updated_at = data.get('updated_at')
        return user

