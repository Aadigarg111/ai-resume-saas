import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import {
  Sparkles,
  ArrowLeft,
  Github,
  Linkedin,
  Link as LinkIcon,
  Plus,
  X,
  Save,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Home
} from 'lucide-react';

// Configure axios base URL
axios.defaults.baseURL = 'https://ai-resume-saas.onrender.com';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    github_url: '',
    linkedin_url: '',
    project_links: [''],
    skills: [''],
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      const profile = response.data.profile;
      
      setFormData({
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        project_links: profile.project_links?.length ? profile.project_links : [''],
        skills: profile.skills?.length ? profile.skills : [''],
        experience: profile.experience?.length ? profile.experience : [{ company: '', position: '', duration: '', description: '' }],
        education: profile.education?.length ? profile.education : [{ institution: '', degree: '', year: '', gpa: '' }]
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleObjectArrayChange = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const { github_url, linkedin_url, project_links } = formData;
    
    const urlPattern = /^https?:\/\/.+/;
    
    if (github_url && !urlPattern.test(github_url)) {
      return 'Please enter a valid GitHub URL (starting with http:// or https://)';
    }
    
    if (linkedin_url && !urlPattern.test(linkedin_url)) {
      return 'Please enter a valid LinkedIn URL (starting with http:// or https://)';
    }
    
    for (const link of project_links) {
      if (link && !urlPattern.test(link)) {
        return 'Please enter valid project URLs (starting with http:// or https://)';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    try {
      // Clean up data before sending
      const cleanData = {
        ...formData,
        project_links: formData.project_links.filter(link => link.trim()),
        skills: formData.skills.filter(skill => skill.trim()),
        experience: formData.experience.filter(exp => exp.company.trim() || exp.position.trim()),
        education: formData.education.filter(edu => edu.institution.trim() || edu.degree.trim())
      };

      await axios.post('/api/profile', cleanData);
      setSuccess('Profile saved successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
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
                <span className="text-xl font-bold gradient-text">Profile Setup</span>
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

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Complete Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your professional information to generate better resumes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Social Links */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                Professional Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Profile URL
                </label>
                <Input
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Linkedin className="mr-2 h-4 w-4 text-blue-500" />
                  LinkedIn Profile URL
                </label>
                <Input
                  placeholder="https://linkedin.com/in/yourusername"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Links</label>
                {formData.project_links.map((link, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder="https://github.com/yourusername/project"
                      value={link}
                      onChange={(e) => handleArrayChange('project_links', index, e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                    {formData.project_links.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('project_links', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('project_links')}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="e.g., JavaScript, React, Python"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                  {formData.skills.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('skills', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('skills')}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience #{index + 1}</h4>
                    {formData.experience.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('experience', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleObjectArrayChange('experience', index, 'company', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                    <Input
                      placeholder="Position/Role"
                      value={exp.position}
                      onChange={(e) => handleObjectArrayChange('experience', index, 'position', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                    value={exp.duration}
                    onChange={(e) => handleObjectArrayChange('experience', index, 'duration', e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                  <Textarea
                    placeholder="Job description and achievements"
                    value={exp.description}
                    onChange={(e) => handleObjectArrayChange('experience', index, 'description', e.target.value)}
                    className="bg-input border-border focus:border-primary"
                    rows={3}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', description: '' })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education #{index + 1}</h4>
                    {formData.education.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('education', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => handleObjectArrayChange('education', index, 'institution', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleObjectArrayChange('education', index, 'degree', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Year (e.g., 2020)"
                      value={edu.year}
                      onChange={(e) => handleObjectArrayChange('education', index, 'year', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                    <Input
                      placeholder="GPA (optional)"
                      value={edu.gpa}
                      onChange={(e) => handleObjectArrayChange('education', index, 'gpa', e.target.value)}
                      className="bg-input border-border focus:border-primary"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('education', { institution: '', degree: '', year: '', gpa: '' })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="gradient-primary hover-lift"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

