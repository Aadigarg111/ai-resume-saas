from datetime import datetime
from bson import ObjectId
from src.database.config import get_collection

class Profile:
    def __init__(self, user_id=None, github_url=None, linkedin_url=None, 
                 project_links=None, skills=None, experience=None, 
                 education=None, _id=None):
        self._id = _id
        self.user_id = user_id
        self.github_url = github_url
        self.linkedin_url = linkedin_url
        self.project_links = project_links or []
        self.skills = skills or []
        self.experience = experience or []
        self.education = education or []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    @staticmethod
    def get_collection():
        return get_collection('profiles')
    
    def save(self):
        """Save profile to database"""
        profile_data = self.to_dict()
        if self._id:
            # Update existing profile
            profile_data['updated_at'] = datetime.utcnow()
            self.get_collection().update_one(
                {'_id': ObjectId(self._id)}, 
                {'$set': profile_data}
            )
        else:
            # Create new profile
            result = self.get_collection().insert_one(profile_data)
            self._id = str(result.inserted_id)
        return self
    
    @classmethod
    def find_by_user_id(cls, user_id):
        """Find profile by user ID"""
        profile_data = cls.get_collection().find_one({'user_id': user_id})
        if profile_data:
            return cls.from_dict(profile_data)
        return None
    
    @classmethod
    def find_by_id(cls, profile_id):
        """Find profile by ID"""
        try:
            profile_data = cls.get_collection().find_one({'_id': ObjectId(profile_id)})
            if profile_data:
                return cls.from_dict(profile_data)
        except:
            pass
        return None
    
    def to_dict(self):
        """Convert profile to dictionary"""
        return {
            'user_id': self.user_id,
            'github_url': self.github_url,
            'linkedin_url': self.linkedin_url,
            'project_links': self.project_links,
            'skills': self.skills,
            'experience': self.experience,
            'education': self.education,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def to_json(self):
        """Convert profile to JSON-serializable format"""
        return {
            'id': str(self._id),
            'user_id': self.user_id,
            'github_url': self.github_url,
            'linkedin_url': self.linkedin_url,
            'project_links': self.project_links,
            'skills': self.skills,
            'experience': self.experience,
            'education': self.education,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create profile from dictionary"""
        profile = cls()
        profile._id = str(data['_id'])
        profile.user_id = data.get('user_id')
        profile.github_url = data.get('github_url')
        profile.linkedin_url = data.get('linkedin_url')
        profile.project_links = data.get('project_links', [])
        profile.skills = data.get('skills', [])
        profile.experience = data.get('experience', [])
        profile.education = data.get('education', [])
        profile.created_at = data.get('created_at')
        profile.updated_at = data.get('updated_at')
        return profile

