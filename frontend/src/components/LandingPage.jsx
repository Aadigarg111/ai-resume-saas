import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight, 
  Github, 
  Linkedin, 
  FileText,
  Brain,
  Rocket,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your GitHub, LinkedIn, and project links to understand your skills and experience."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Professional Resumes",
      description: "Generate beautiful, ATS-friendly resumes tailored to your unique profile and experience."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Generation",
      description: "Get your resume and expertise report in seconds, not hours. Fast and efficient processing."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your information with third parties."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Your Profiles",
      description: "Link your GitHub, LinkedIn, and project repositories"
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI analyzes your code, projects, and professional history"
    },
    {
      number: "03",
      title: "Get Your Resume",
      description: "Receive a professional resume and detailed expertise report"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">ResumeAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="gradient-primary hover-lift">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-float">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-shadow">
              Build Your
              <span className="gradient-text block">Perfect Resume</span>
              with AI
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect your GitHub, LinkedIn, and projects. Our AI analyzes your profile 
            and generates a professional resume with detailed expertise insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="gradient-primary hover-lift glow-primary text-lg px-8 py-4">
                <Rocket className="mr-2 h-5 w-5" />
                Start Building Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary/50 hover:border-primary">
              <FileText className="mr-2 h-5 w-5" />
              View Sample Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">ResumeAI</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI technology to create resumes that stand out
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect hover-lift border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to your perfect resume
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-4 h-8 w-8 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Connect Your <span className="gradient-text">Profiles</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            We analyze data from your favorite platforms
          </p>
          <div className="flex justify-center items-center space-x-12">
            <div className="flex flex-col items-center space-y-4">
              <Github className="h-16 w-16 text-foreground" />
              <span className="text-lg font-semibold">GitHub</span>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Linkedin className="h-16 w-16 text-blue-500" />
              <span className="text-lg font-semibold">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-16 w-16 text-accent" />
              <span className="text-lg font-semibold">Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your <span className="gradient-text">Dream Resume</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already created their perfect resume with AI
          </p>
          <Link to="/register">
            <Button size="lg" className="gradient-primary hover-lift glow-primary text-lg px-12 py-4">
              <Star className="mr-2 h-5 w-5" />
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 ResumeAI. All rights reserved. Built with AI for the future of work.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

