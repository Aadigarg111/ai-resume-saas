from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.profile import Profile
import re

profile_bp = Blueprint('profile', __name__)

def validate_url(url):
    """Validate URL format"""
    if not url:
        return True  # Empty URLs are allowed
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(pattern, url) is not None

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        profile = Profile.find_by_user_id(current_user_id)
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        return jsonify({
            'profile': profile.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get profile: {str(e)}'}), 500

@profile_bp.route('/', methods=['POST'])
@jwt_required()
def create_or_update_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate URLs
        github_url = data.get('github_url', '').strip()
        linkedin_url = data.get('linkedin_url', '').strip()
        
        if github_url and not validate_url(github_url):
            return jsonify({'error': 'Invalid GitHub URL format'}), 400
        
        if linkedin_url and not validate_url(linkedin_url):
            return jsonify({'error': 'Invalid LinkedIn URL format'}), 400
        
        # Validate project links
        project_links = data.get('project_links', [])
        if not isinstance(project_links, list):
            return jsonify({'error': 'Project links must be an array'}), 400
        
        for link in project_links:
            if not validate_url(link):
                return jsonify({'error': f'Invalid project URL: {link}'}), 400
        
        # Find existing profile or create new one
        profile = Profile.find_by_user_id(current_user_id)
        
        if profile:
            # Update existing profile
            profile.github_url = github_url
            profile.linkedin_url = linkedin_url
            profile.project_links = project_links
            profile.skills = data.get('skills', [])
            profile.experience = data.get('experience', [])
            profile.education = data.get('education', [])
        else:
            # Create new profile
            profile = Profile(
                user_id=current_user_id,
                github_url=github_url,
                linkedin_url=linkedin_url,
                project_links=project_links,
                skills=data.get('skills', []),
                experience=data.get('experience', []),
                education=data.get('education', [])
            )
        
        profile.save()
        
        return jsonify({
            'message': 'Profile saved successfully',
            'profile': profile.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to save profile: {str(e)}'}), 500

@profile_bp.route('/skills', methods=['POST'])
@jwt_required()
def add_skill():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'skill' not in data:
            return jsonify({'error': 'Skill is required'}), 400
        
        skill = data['skill'].strip()
        if not skill:
            return jsonify({'error': 'Skill cannot be empty'}), 400
        
        profile = Profile.find_by_user_id(current_user_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        if skill not in profile.skills:
            profile.skills.append(skill)
            profile.save()
        
        return jsonify({
            'message': 'Skill added successfully',
            'skills': profile.skills
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to add skill: {str(e)}'}), 500

@profile_bp.route('/experience', methods=['POST'])
@jwt_required()
def add_experience():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['company', 'position', 'duration']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Company, position, and duration are required'}), 400
        
        experience = {
            'company': data['company'].strip(),
            'position': data['position'].strip(),
            'duration': data['duration'].strip(),
            'description': data.get('description', '').strip()
        }
        
        profile = Profile.find_by_user_id(current_user_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        profile.experience.append(experience)
        profile.save()
        
        return jsonify({
            'message': 'Experience added successfully',
            'experience': profile.experience
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to add experience: {str(e)}'}), 500

@profile_bp.route('/education', methods=['POST'])
@jwt_required()
def add_education():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['institution', 'degree', 'year']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Institution, degree, and year are required'}), 400
        
        education = {
            'institution': data['institution'].strip(),
            'degree': data['degree'].strip(),
            'year': data['year'].strip(),
            'gpa': data.get('gpa', '').strip()
        }
        
        profile = Profile.find_by_user_id(current_user_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        profile.education.append(education)
        profile.save()
        
        return jsonify({
            'message': 'Education added successfully',
            'education': profile.education
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to add education: {str(e)}'}), 500

