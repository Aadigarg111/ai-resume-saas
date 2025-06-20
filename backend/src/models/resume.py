from datetime import datetime
from bson import ObjectId
from src.database.config import get_collection

class Resume:
    def __init__(self, user_id=None, profile_id=None, resume_data=None, 
                 expertise_report=None, pdf_path=None, _id=None):
        self._id = _id
        self.user_id = user_id
        self.profile_id = profile_id
        self.resume_data = resume_data or {}
        self.expertise_report = expertise_report or {}
        self.pdf_path = pdf_path
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    @staticmethod
    def get_collection():
        return get_collection('resumes')
    
    def save(self):
        """Save resume to database"""
        resume_data = self.to_dict()
        if self._id:
            # Update existing resume
            resume_data['updated_at'] = datetime.utcnow()
            self.get_collection().update_one(
                {'_id': ObjectId(self._id)}, 
                {'$set': resume_data}
            )
        else:
            # Create new resume
            result = self.get_collection().insert_one(resume_data)
            self._id = str(result.inserted_id)
        return self
    
    @classmethod
    def find_by_user_id(cls, user_id):
        """Find resumes by user ID"""
        resumes_data = cls.get_collection().find({'user_id': user_id})
        return [cls.from_dict(resume_data) for resume_data in resumes_data]
    
    @classmethod
    def find_by_id(cls, resume_id):
        """Find resume by ID"""
        try:
            resume_data = cls.get_collection().find_one({'_id': ObjectId(resume_id)})
            if resume_data:
                return cls.from_dict(resume_data)
        except:
            pass
        return None
    
    @classmethod
    def find_latest_by_user_id(cls, user_id):
        """Find latest resume by user ID"""
        resume_data = cls.get_collection().find_one(
            {'user_id': user_id}, 
            sort=[('created_at', -1)]
        )
        if resume_data:
            return cls.from_dict(resume_data)
        return None
    
    def to_dict(self):
        """Convert resume to dictionary"""
        return {
            'user_id': self.user_id,
            'profile_id': self.profile_id,
            'resume_data': self.resume_data,
            'expertise_report': self.expertise_report,
            'pdf_path': self.pdf_path,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def to_json(self):
        """Convert resume to JSON-serializable format"""
        return {
            'id': str(self._id),
            'user_id': self.user_id,
            'profile_id': self.profile_id,
            'resume_data': self.resume_data,
            'expertise_report': self.expertise_report,
            'pdf_path': self.pdf_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create resume from dictionary"""
        resume = cls()
        resume._id = str(data['_id'])
        resume.user_id = data.get('user_id')
        resume.profile_id = data.get('profile_id')
        resume.resume_data = data.get('resume_data', {})
        resume.expertise_report = data.get('expertise_report', {})
        resume.pdf_path = data.get('pdf_path')
        resume.created_at = data.get('created_at')
        resume.updated_at = data.get('updated_at')
        return resume

