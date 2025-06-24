from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models.user import User
import re
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint(\'auth\', __name__)

def validate_email(email):
    \"\"\"Validate email format\"\"\"
    pattern = r\'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'
    return re.match(pattern, email) is not None

def validate_password(password):
    \"\"\"Validate password strength\"\"\"
    if len(password) < 6:
        return False, \"Password must be at least 6 characters long\"
    return True, \"Password is valid\"

@auth_bp.route(\'/register\', methods=[\'POST\'])
def register():
    try:
        data = request.get_json()
        logger.info(f\'Received registration data: {data}\' )
        
        if not data:
            logger.error(\'No data provided for registration\')
            return jsonify({\'error\': \'No data provided\'}), 400
        
        username = data.get(\'username\', \'\').strip()
        email = data.get(\'email\', \'\').strip().lower()
        password = data.get(\'password\', \'\')
        
        logger.info(f\'Attempting registration for user: {username}, email: {email}\' )

        # Validation
        if not username or not email or not password:
            logger.error(\'Missing required fields for registration\')
            return jsonify({\'error\': \'Username, email, and password are required\'}), 400
        
        if not validate_email(email):
            logger.error(f\'Invalid email format: {email}\')
            return jsonify({\'error\': \'Invalid email format\'}), 400
        
        is_valid, message = validate_password(password)
        if not is_valid:
            logger.error(f\'Invalid password: {message}\')
            return jsonify({\'error\': message}), 400
        
        # Check if user already exists
        existing_user_email = User.find_by_email(email)
        logger.info(f\'Existing user by email ({email}): {existing_user_email}\' )
        if existing_user_email:
            logger.warning(f\'Email already registered: {email}\')
            return jsonify({\'error\': \'Email already registered\'}), 409
        
        existing_user_username = User.find_by_username(username)
        logger.info(f\'Existing user by username ({username}): {existing_user_username}\' )
        if existing_user_username:
            logger.warning(f\'Username already taken: {username}\')
            return jsonify({\'error\': \'Username already taken\'}), 409
        
        # Create new user
        user = User(username=username, email=email, password=password)
        logger.info(f\'Created new User object: {user}\' )
        user.save()
        logger.info(f\'User saved successfully: {user._id}\' )
        
        # Create access token
        access_token = create_access_token(identity=str(user._id))
        logger.info(f\'Access token created for user: {user._id}\' )
        
        return jsonify({
            \'message\': \'User registered successfully\',
            \'access_token\': access_token,
            \'user\': user.to_json()
        }), 201
        
    except Exception as e:
        logger.exception(\'Registration failed unexpectedly\') # This will print the full traceback
        return jsonify({\'error\': f\'Registration failed: {str(e)}\'}), 500

@auth_bp.route(\'/login\', methods=[\'POST\'])
def login():
    try:
        data = request.get_json()
        logger.info(f\'Received login data: {data}\' )
        
        if not data:
            logger.error(\'No data provided for login\')
            return jsonify({\'error\': \'No data provided\'}), 400
        
        email = data.get(\'email\', \'\').strip().lower()
        password = data.get(\'password\', \'\')
        
        logger.info(f\'Attempting login for email: {email}\' )

        if not email or not password:
            logger.error(\'Missing email or password for login\')
            return jsonify({\'error\': \'Email and password are required\'}), 400
        
        # Find user by email
        user = User.find_by_email(email)
        logger.info(f\'User found by email ({email}): {user}\' )
        if not user or not user.check_password(password):
            logger.warning(\'Invalid email or password attempt\')
            return jsonify({\'error\': \'Invalid email or password\'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user._id))
        logger.info(f\'Access token created for user: {user._id}\' )
        
        return jsonify({
            \'message\': \'Login successful\',
            \'access_token\': access_token,
            \'user\': user.to_json()
        }), 200
        
    except Exception as e:
        logger.exception(\'Login failed unexpectedly\') # This will print the full traceback
        return jsonify({\'error\': f\'Login failed: {str(e)}\'}), 500

@auth_bp.route(\'/me\', methods=[\'GET\'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        logger.info(f\'Fetching current user with ID: {current_user_id}\' )
        user = User.find_by_id(current_user_id)
        
        if not user:
            logger.warning(f\'User not found for ID: {current_user_id}\')
            return jsonify({\'error\': \'User not found\'}), 404
        
        return jsonify({
            \'user\': user.to_json()
        }), 200
        
    except Exception as e:
        logger.exception(\'Failed to get user info unexpectedly\')
        return jsonify({\'error\': f\'Failed to get user info: {str(e)}\'}), 500

@auth_bp.route(\'/logout\', methods=[\'POST\'])
@jwt_required()
def logout():
    logger.info(\'User logged out\')
    # In a real application, you might want to blacklist the token
    # For now, we\'ll just return a success message
    return jsonify({\'message\': \'Logout successful\'}), 200



