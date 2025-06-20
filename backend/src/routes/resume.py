from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.resume import Resume
from src.models.profile import Profile
from src.models.user import User
from src.services.ai_service import ai_service
import os
import json
from datetime import datetime

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/', methods=['GET'])
@jwt_required()
def get_resumes():
    try:
        current_user_id = get_jwt_identity()
        resumes = Resume.find_by_user_id(current_user_id)
        
        return jsonify({
            'resumes': [resume.to_json() for resume in resumes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get resumes: {str(e)}'}), 500

@resume_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_resume():
    try:
        current_user_id = get_jwt_identity()
        resume = Resume.find_latest_by_user_id(current_user_id)
        
        if not resume:
            return jsonify({'message': 'No resume found'}), 404
        
        return jsonify({
            'resume': resume.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get latest resume: {str(e)}'}), 500

@resume_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_resume():
    try:
        current_user_id = get_jwt_identity()
        
        # Get user profile
        profile = Profile.find_by_user_id(current_user_id)
        if not profile:
            return jsonify({'error': 'Profile not found. Please create a profile first.'}), 404
        
        # Get user info
        user = User.find_by_id(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Perform AI analysis
        ai_analysis = {}
        
        # Analyze GitHub profile
        if profile.github_url:
            github_analysis = ai_service.analyze_github_profile(profile.github_url)
            ai_analysis['github'] = github_analysis
        
        # Analyze LinkedIn profile
        if profile.linkedin_url:
            linkedin_analysis = ai_service.analyze_linkedin_profile(profile.linkedin_url)
            ai_analysis['linkedin'] = linkedin_analysis
        
        # Analyze project links
        if profile.project_links:
            projects_analysis = ai_service.analyze_project_links(profile.project_links)
            ai_analysis['projects'] = projects_analysis
        
        # Prepare profile data for AI
        profile_data = {
            'personal_info': {
                'name': user.username,
                'email': user.email,
                'github': profile.github_url,
                'linkedin': profile.linkedin_url
            },
            'skills': profile.skills,
            'experience': profile.experience,
            'education': profile.education,
            'projects': [{'url': url} for url in profile.project_links]
        }
        
        # Generate enhanced resume content
        enhanced_resume = ai_service.generate_resume_content(profile_data, ai_analysis)
        
        # Generate expertise report
        expertise_report = ai_service.generate_expertise_report(profile_data, ai_analysis)
        
        # Combine original data with AI enhancements
        final_resume_data = {
            **profile_data,
            'ai_enhanced': enhanced_resume,
            'ai_analysis': ai_analysis
        }
        
        # Create resume record
        resume = Resume(
            user_id=current_user_id,
            profile_id=str(profile._id),
            resume_data=final_resume_data,
            expertise_report=expertise_report
        )
        resume.save()
        
        return jsonify({
            'message': 'Resume generated successfully',
            'resume': resume.to_json()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate resume: {str(e)}'}), 500

@resume_bp.route('/<resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    try:
        current_user_id = get_jwt_identity()
        resume = Resume.find_by_id(resume_id)
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Check if resume belongs to current user
        if resume.user_id != current_user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'resume': resume.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get resume: {str(e)}'}), 500

@resume_bp.route('/<resume_id>/download', methods=['GET'])
@jwt_required()
def download_resume(resume_id):
    try:
        current_user_id = get_jwt_identity()
        resume = Resume.find_by_id(resume_id)
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Check if resume belongs to current user
        if resume.user_id != current_user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Generate PDF if it doesn't exist
        if not resume.pdf_path or not os.path.exists(resume.pdf_path):
            pdf_path = generate_resume_pdf(resume)
            resume.pdf_path = pdf_path
            resume.save()
        
        return send_file(
            resume.pdf_path,
            as_attachment=True,
            download_name=f'resume_{resume_id}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to download resume: {str(e)}'}), 500

@resume_bp.route('/<resume_id>/expertise', methods=['GET'])
@jwt_required()
def get_expertise_report(resume_id):
    try:
        current_user_id = get_jwt_identity()
        resume = Resume.find_by_id(resume_id)
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Check if resume belongs to current user
        if resume.user_id != current_user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'expertise_report': resume.expertise_report
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get expertise report: {str(e)}'}), 500

def generate_resume_pdf(resume):
    """Generate PDF from resume data"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        
        # Create PDF directory if it doesn't exist
        pdf_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'pdfs')
        os.makedirs(pdf_dir, exist_ok=True)
        
        # Generate unique filename
        filename = f"resume_{resume._id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(pdf_dir, filename)
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor='#9945ff'
        )
        story.append(Paragraph("Professional Resume", title_style))
        story.append(Spacer(1, 12))
        
        # Personal Information
        resume_data = resume.resume_data
        personal_info = resume_data.get('personal_info', {})
        
        story.append(Paragraph("Personal Information", styles['Heading2']))
        story.append(Paragraph(f"Name: {personal_info.get('name', 'N/A')}", styles['Normal']))
        story.append(Paragraph(f"Email: {personal_info.get('email', 'N/A')}", styles['Normal']))
        if personal_info.get('github'):
            story.append(Paragraph(f"GitHub: {personal_info.get('github')}", styles['Normal']))
        if personal_info.get('linkedin'):
            story.append(Paragraph(f"LinkedIn: {personal_info.get('linkedin')}", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # AI Enhanced Summary
        ai_enhanced = resume_data.get('ai_enhanced', {})
        if ai_enhanced.get('professional_summary'):
            story.append(Paragraph("Professional Summary", styles['Heading2']))
            story.append(Paragraph(ai_enhanced['professional_summary'], styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Skills
        skills = resume_data.get('skills', [])
        if skills:
            story.append(Paragraph("Skills", styles['Heading2']))
            skills_text = ", ".join(skills)
            story.append(Paragraph(skills_text, styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Experience
        experience = resume_data.get('experience', [])
        if experience:
            story.append(Paragraph("Work Experience", styles['Heading2']))
            for exp in experience:
                story.append(Paragraph(f"<b>{exp.get('position', 'N/A')}</b> at {exp.get('company', 'N/A')}", styles['Normal']))
                story.append(Paragraph(f"Duration: {exp.get('duration', 'N/A')}", styles['Normal']))
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Education
        education = resume_data.get('education', [])
        if education:
            story.append(Paragraph("Education", styles['Heading2']))
            for edu in education:
                story.append(Paragraph(f"<b>{edu.get('degree', 'N/A')}</b> from {edu.get('institution', 'N/A')}", styles['Normal']))
                story.append(Paragraph(f"Year: {edu.get('year', 'N/A')}", styles['Normal']))
                if edu.get('gpa'):
                    story.append(Paragraph(f"GPA: {edu['gpa']}", styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Projects
        projects = resume_data.get('projects', [])
        if projects:
            story.append(Paragraph("Projects", styles['Heading2']))
            for i, project in enumerate(projects, 1):
                story.append(Paragraph(f"Project {i}: {project.get('url', 'N/A')}", styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        return pdf_path
        
    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        return None

