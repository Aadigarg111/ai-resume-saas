import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Target,
  Home
} from 'lucide-react';

// Configure axios base URL
axios.defaults.baseURL = 'https://ai-resume-saas.onrender.com';

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
      const response = await axios.get(`/api/resume/${id}`);
      setResume(response.data.resume);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/resume/${id}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${id.slice(-6)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
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
    if (score >= 90) return { level: 'Expert', color: 'text-green-500' };
    if (score >= 75) return { level: 'Advanced', color: 'text-blue-500' };
    if (score >= 60) return { level: 'Intermediate', color: 'text-yellow-500' };
    return { level: 'Beginner', color: 'text-gray-500' };
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
        <div className="text-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
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
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Resume <span className="gradient-text">#{resume.id.slice(-6)}</span>
            </h1>
            <p className="text-muted-foreground">
              Generated on {formatDate(resume.created_at)}
            </p>
          </div>
          <div className="flex space-x-4">
            {resume.pdf_path && (
              <Button onClick={handleDownload} className="gradient-primary hover-lift">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume HTML Content */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: resume.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Expertise Report */}
          <div className="space-y-6">
            {resume.expertise_report && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    AI Expertise Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  {resume.expertise_report.overall_score && (
                    <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {resume.expertise_report.overall_score}/100
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Expertise Score</p>
                    </div>
                  )}

                  {/* Skills Analysis */}
                  {resume.expertise_report.skills && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Skills Analysis
                      </h4>
                      <div className="space-y-3">
                        {resume.expertise_report.skills.map((skill, index) => {
                          const skillInfo = getSkillLevel(skill.score);
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className={`text-xs ${skillInfo.color}`}>
                                  {skillInfo.level}
                                </span>
                              </div>
                              <Progress value={skill.score} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {skill.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {resume.expertise_report.strengths && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Award className="mr-2 h-4 w-4 text-green-500" />
                        Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {resume.expertise_report.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-3 w-3 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {resume.expertise_report.recommendations && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {resume.expertise_report.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="h-3 w-3 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {resume.expertise_report.summary && (
                    <div className="p-4 bg-card/50 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2">AI Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {resume.expertise_report.summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resume Info */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Resume Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resume ID</span>
                    <span className="text-sm font-mono">#{resume.id.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm">{formatDate(resume.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm text-green-500">Generated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;

