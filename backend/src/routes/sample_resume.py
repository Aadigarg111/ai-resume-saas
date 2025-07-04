from flask import Blueprint, jsonify
import json
import os

sample_resume_bp = Blueprint("sample_resume_bp", __name__)

@sample_resume_bp.route("/sample-resume", methods=["GET"])
def get_sample_resume():
    try:
        sample_resume_path = os.path.join(os.path.dirname(__file__), "../sample_resume.json")
        with open(sample_resume_path, "r") as f:
            sample_resume_data = json.load(f)
        return jsonify({"resume": sample_resume_data}), 200
    except FileNotFoundError:
        return jsonify({"error": "Sample resume not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


