import os
import sys
# DON\'T CHANGE THE LINE BELOW
sys.path.append(os.path.join(os.path.dirname(__file__), \'..\'))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.database.config import mongo
from src.routes.auth import auth_bp
from src.routes.profile import profile_bp
from src.routes.resume import resume_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure MongoDB from environment variable
app.config[\'MONGO_URI\'] = os.environ.get(\'MONGO_URI\')
mongo.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix=\'/api/auth\')
app.register_blueprint(profile_bp, url_prefix=\'/api/profile\')
app.register_blueprint(resume_bp, url_prefix=\'/api/resume\')

# Serve React App
static_folder_path = os.path.join(os.path.dirname(__file__), \'../../frontend/dist\')

@app.route(\'/\')
def serve_root():
    return send_from_directory(static_folder_path, \'index.html\')

@app.route(\'/<path:path>\')
def serve_static(path):
    if os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, \'index.html\') # Fallback for client-side routing

@app.route(\'/api/health\')
def health_check():
    print(\'Health check endpoint hit!\') # Added print statement
    return {\'status\': \'healthy\', \'message\': \'AI Resume SaaS API is running\'}

if __name__ == \'__main__\':
    print(\'Starting Flask app...\') # Added print statement
    app.run(host=\'0.0.0.0\', port=5000, debug=True)


