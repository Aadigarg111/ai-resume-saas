import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { 
  Sparkles, 
  ArrowLeft, 
  Download, 
  FileText, 
  Brain, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  Loader2,
  Star,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

const ResumeViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/resume/${id}`);
      setResume(response.data.resume);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/resume/${id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download resume');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSkillLevel = (score) => {
    if (score >= 80) return { level: 'Expert', color: 'text-green-500' };
    if (score >= 60) return { level: 'Advanced', color: 'text-blue-500' };
    if (score >= 40) return { level: 'Intermediate', color: 'text-yellow-500' };
    return { level: 'Beginner', color: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resume Not Found</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold gradient-text">Resume Viewer</span>
              </div>
            </div>
            <Button onClick={handleDownload} className="gradient-primary hover-lift">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Resume <span className="gradient-text">#{resume.id.slice(-6)}</span>
          </h1>
          <p className="text-muted-foreground">
            Generated on {formatDate(resume.created_at)}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Content */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b border-border pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{resume.resume_data.personal_info?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{resume.resume_data.personal_info?.email}</span>
                    </div>
                    {resume.resume_data.personal_info?.github && (
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={resume.resume_data.personal_info.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          GitHub Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {resume.resume_data.personal_info?.linkedin && (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                        <a 
                          href={resume.resume_data.personal_info.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          LinkedIn Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {resume.resume_data.skills?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-border pb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.resume_data.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {resume.resume_data.experience?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-border pb-2">
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {resume.resume_data.experience.map((exp, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{exp.position}</h4>
                              <p className="text-primary">{exp.company}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{exp.duration}</span>
                          </div>
                          {exp.description && (
                            <p className="text-muted-foreground">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.resume_data.education?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-border pb-2">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {resume.resume_data.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-primary">{edu.institution}</p>
                            {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                          </div>
                          <span className="text-sm text-muted-foreground">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resume.resume_data.projects?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-border pb-2">
                      Projects
                    </h3>
                    <div className="space-y-2">
                      {resume.resume_data.projects.map((project, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Project {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expertise Report */}
          <div className="lg:col-span-1">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Expertise Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center space-y-4">
                  <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">
                      {resume.expertise_report.overall_score || 0}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Overall Score</h3>
                    <p className="text-muted-foreground text-sm">
                      Based on AI analysis of your profile
                    </p>
                  </div>
                </div>

                {/* Skill Assessments */}
                {Object.keys(resume.expertise_report.skill_assessments || {}).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Skill Assessments
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(resume.expertise_report.skill_assessments).map(([skill, score]) => {
                        const skillInfo = getSkillLevel(score);
                        return (
                          <div key={skill} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{skill}</span>
                              <span className={`text-xs ${skillInfo.color}`}>
                                {skillInfo.level}
                              </span>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {resume.expertise_report.strengths?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {resume.expertise_report.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <Award className="mr-2 h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {resume.expertise_report.areas_for_improvement?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Target className="mr-2 h-4 w-4 text-yellow-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {resume.expertise_report.areas_for_improvement.map((area, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <Target className="mr-2 h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {resume.expertise_report.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Recommendations</h4>
                    <ul className="space-y-2">
                      {resume.expertise_report.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Empty State */}
                {Object.keys(resume.expertise_report).length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      AI analysis will be available soon
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;

