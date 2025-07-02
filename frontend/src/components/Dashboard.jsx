import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { 
  Sparkles, 
  User, 
  FileText, 
  Plus, 
  Settings, 
  Github, 
  Linkedin, 
  ExternalLink,
  Download,
  Eye,
  Loader2,
  Brain,
  Calendar,
  Home
} from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      try {
        const profileResponse = await axios.get('/api/profile');
        setProfile(profileResponse.data.profile);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching profile:', err);
        }
      }

      // Fetch resumes
      try {
        const resumesResponse = await axios.get('/api/resume');
        setResumes(resumesResponse.data.resumes);
      } catch (err) {
        console.error('Error fetching resumes:', err);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!profile) {
      setError('Please create a profile first');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      
      const response = await axios.post('/api/resume/generate');
      
      // Refresh resumes list
      await fetchData();
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">ResumeAI</span>
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

      <div className="container mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="gradient-text">ResumeAI</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile and generate AI-powered resumes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm text-green-500 font-medium">Complete</span>
                    </div>
                    
                    {profile.github_url && (
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={profile.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center"
                        >
                          GitHub Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    {profile.linkedin_url && (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                        <a 
                          href={profile.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center"
                        >
                          LinkedIn Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      <p>{profile.project_links?.length || 0} project links</p>
                      <p>{profile.skills?.length || 0} skills</p>
                      <p>{profile.experience?.length || 0} work experiences</p>
                    </div>
                    
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">No profile found</p>
                    <Link to="/profile">
                      <Button className="w-full gradient-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumes Section */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Your Resumes
                  </CardTitle>
                  <Button 
                    onClick={handleGenerateResume}
                    disabled={!profile || generating}
                    className="gradient-primary hover-lift"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {resumes.length > 0 ? (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <Card key={resume.id} className="border-border hover-lift">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold">Resume #{resume.id.slice(-6)}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                Created {formatDate(resume.created_at)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link to={`/resume/${resume.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                              </Link>
                              {resume.pdf_path && (
                                <Button variant="outline" size="sm">
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your profile and generate your first AI-powered resume
                    </p>
                    {!profile && (
                      <Link to="/profile">
                        <Button className="gradient-primary">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Profile First
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="gradient-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{resumes.length}</h3>
              <p className="text-muted-foreground">Resumes Generated</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="gradient-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{profile ? '1' : '0'}</h3>
              <p className="text-muted-foreground">Profile Complete</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="gradient-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{profile?.skills?.length || 0}</h3>
              <p className="text-muted-foreground">Skills Analyzed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

