import google.generativeai as genai
import requests
import json
import re
from typing import Dict, List, Any
import os

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyDmlVE0m_eesKqQexv0K7T2OKG9PEn8KeU"
genai.configure(api_key=GEMINI_API_KEY)

class AIAnalysisService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_github_profile(self, github_url: str) -> Dict[str, Any]:
        """Analyze GitHub profile and extract relevant information"""
        try:
            # Extract username from GitHub URL
            username = self._extract_github_username(github_url)
            if not username:
                return {"error": "Invalid GitHub URL"}
            
            # Get GitHub user data (public API, no auth needed)
            user_data = self._fetch_github_user_data(username)
            repos_data = self._fetch_github_repos(username)
            
            # Analyze with Gemini
            analysis_prompt = f"""
            Analyze this GitHub profile data and provide insights:
            
            User Profile:
            - Username: {user_data.get('login', 'N/A')}
            - Name: {user_data.get('name', 'N/A')}
            - Bio: {user_data.get('bio', 'N/A')}
            - Public Repos: {user_data.get('public_repos', 0)}
            - Followers: {user_data.get('followers', 0)}
            - Following: {user_data.get('following', 0)}
            - Company: {user_data.get('company', 'N/A')}
            - Location: {user_data.get('location', 'N/A')}
            
            Top Repositories:
            {self._format_repos_for_analysis(repos_data[:10])}
            
            Please provide:
            1. Primary programming languages (based on repo languages)
            2. Technical skills assessment
            3. Project complexity level (1-10)
            4. Areas of expertise
            5. Recommended improvements
            
            Format as JSON with keys: languages, skills, complexity_score, expertise_areas, recommendations
            """
            
            response = self.model.generate_content(analysis_prompt)
            return self._parse_ai_response(response.text)
            
        except Exception as e:
            return {"error": f"GitHub analysis failed: {str(e)}"}
    
    def analyze_linkedin_profile(self, linkedin_url: str) -> Dict[str, Any]:
        """Analyze LinkedIn profile (limited without API access)"""
        try:
            # Since LinkedIn API requires special access, we'll do basic URL validation
            # and provide general analysis based on the URL structure
            
            if not self._is_valid_linkedin_url(linkedin_url):
                return {"error": "Invalid LinkedIn URL"}
            
            analysis_prompt = f"""
            Based on this LinkedIn profile URL: {linkedin_url}
            
            Provide general professional insights for someone with a LinkedIn profile:
            1. Professional networking score (1-10)
            2. Industry presence assessment
            3. Career development recommendations
            4. Professional skills that are typically valuable
            
            Format as JSON with keys: networking_score, industry_presence, career_recommendations, valuable_skills
            """
            
            response = self.model.generate_content(analysis_prompt)
            return self._parse_ai_response(response.text)
            
        except Exception as e:
            return {"error": f"LinkedIn analysis failed: {str(e)}"}
    
    def analyze_project_links(self, project_links: List[str]) -> Dict[str, Any]:
        """Analyze project links and extract insights"""
        try:
            projects_info = []
            for link in project_links:
                if self._is_github_repo_url(link):
                    repo_info = self._analyze_github_repo(link)
                    projects_info.append(repo_info)
                else:
                    # For non-GitHub links, do basic analysis
                    projects_info.append({"url": link, "type": "external_project"})
            
            analysis_prompt = f"""
            Analyze these project links and provide insights:
            
            Projects:
            {json.dumps(projects_info, indent=2)}
            
            Please provide:
            1. Overall project quality assessment (1-10)
            2. Technology stack diversity
            3. Project complexity levels
            4. Innovation and creativity score
            5. Areas for improvement
            
            Format as JSON with keys: quality_score, tech_diversity, complexity_levels, innovation_score, improvements
            """
            
            response = self.model.generate_content(analysis_prompt)
            return self._parse_ai_response(response.text)
            
        except Exception as e:
            return {"error": f"Project analysis failed: {str(e)}"}
    
    def generate_resume_content(self, profile_data: Dict[str, Any], ai_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive resume content using AI"""
        try:
            resume_prompt = f"""
            Generate a professional resume based on this profile data and AI analysis:
            
            Profile Data:
            {json.dumps(profile_data, indent=2)}
            
            AI Analysis:
            {json.dumps(ai_analysis, indent=2)}
            
            Create a comprehensive resume with:
            1. Professional summary (2-3 sentences)
            2. Enhanced skills list with proficiency levels
            3. Improved project descriptions
            4. Technical achievements
            5. Professional strengths
            
            Format as JSON with keys: professional_summary, enhanced_skills, project_descriptions, achievements, strengths
            """
            
            response = self.model.generate_content(resume_prompt)
            return self._parse_ai_response(response.text)
            
        except Exception as e:
            return {"error": f"Resume generation failed: {str(e)}"}
    
    def generate_expertise_report(self, profile_data: Dict[str, Any], ai_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed expertise report"""
        try:
            expertise_prompt = f"""
            Generate a detailed expertise report based on this data:
            
            Profile Data:
            {json.dumps(profile_data, indent=2)}
            
            AI Analysis:
            {json.dumps(ai_analysis, indent=2)}
            
            Provide:
            1. Overall expertise score (0-100)
            2. Skill assessments with scores for each technology
            3. Top 5 strengths
            4. Top 3 areas for improvement
            5. Career development recommendations
            6. Technology learning path suggestions
            
            Format as JSON with keys: overall_score, skill_assessments, strengths, areas_for_improvement, career_recommendations, learning_path
            """
            
            response = self.model.generate_content(expertise_prompt)
            return self._parse_ai_response(response.text)
            
        except Exception as e:
            return {"error": f"Expertise report generation failed: {str(e)}"}
    
    def _extract_github_username(self, github_url: str) -> str:
        """Extract username from GitHub URL"""
        pattern = r'github\.com/([^/]+)'
        match = re.search(pattern, github_url)
        return match.group(1) if match else None
    
    def _fetch_github_user_data(self, username: str) -> Dict[str, Any]:
        """Fetch GitHub user data using public API"""
        try:
            response = requests.get(f"https://api.github.com/users/{username}")
            return response.json() if response.status_code == 200 else {}
        except:
            return {}
    
    def _fetch_github_repos(self, username: str) -> List[Dict[str, Any]]:
        """Fetch GitHub repositories using public API"""
        try:
            response = requests.get(f"https://api.github.com/users/{username}/repos?sort=updated&per_page=20")
            return response.json() if response.status_code == 200 else []
        except:
            return []
    
    def _format_repos_for_analysis(self, repos: List[Dict[str, Any]]) -> str:
        """Format repositories data for AI analysis"""
        formatted = []
        for repo in repos:
            formatted.append(f"- {repo.get('name', 'N/A')}: {repo.get('description', 'No description')} "
                           f"(Language: {repo.get('language', 'N/A')}, Stars: {repo.get('stargazers_count', 0)})")
        return "\n".join(formatted)
    
    def _is_valid_linkedin_url(self, url: str) -> bool:
        """Validate LinkedIn URL format"""
        pattern = r'linkedin\.com/in/[^/]+'
        return bool(re.search(pattern, url))
    
    def _is_github_repo_url(self, url: str) -> bool:
        """Check if URL is a GitHub repository"""
        pattern = r'github\.com/[^/]+/[^/]+'
        return bool(re.search(pattern, url))
    
    def _analyze_github_repo(self, repo_url: str) -> Dict[str, Any]:
        """Analyze individual GitHub repository"""
        try:
            # Extract owner and repo name
            pattern = r'github\.com/([^/]+)/([^/]+)'
            match = re.search(pattern, repo_url)
            if not match:
                return {"url": repo_url, "error": "Invalid GitHub repo URL"}
            
            owner, repo = match.groups()
            response = requests.get(f"https://api.github.com/repos/{owner}/{repo}")
            
            if response.status_code == 200:
                repo_data = response.json()
                return {
                    "url": repo_url,
                    "name": repo_data.get('name'),
                    "description": repo_data.get('description'),
                    "language": repo_data.get('language'),
                    "stars": repo_data.get('stargazers_count', 0),
                    "forks": repo_data.get('forks_count', 0),
                    "size": repo_data.get('size', 0)
                }
            else:
                return {"url": repo_url, "error": "Repository not accessible"}
        except:
            return {"url": repo_url, "error": "Analysis failed"}
    
    def _parse_ai_response(self, response_text: str) -> Dict[str, Any]:
        """Parse AI response and extract JSON"""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # If no JSON found, return the text as analysis
                return {"analysis": response_text}
        except json.JSONDecodeError:
            return {"analysis": response_text}
        except Exception as e:
            return {"error": f"Failed to parse AI response: {str(e)}"}

# Initialize the service
ai_service = AIAnalysisService()

