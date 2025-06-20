# ResumeAI - AI-Powered Resume Generator

A modern AI SaaS product that analyzes user profiles from GitHub, LinkedIn, and project links to generate professional resumes and detailed expertise reports using Google's Gemini AI.

## 🌟 Features

- **Modern Solana-Inspired Dark Theme UI** - Beautiful, responsive design with gradient effects
- **AI-Powered Analysis** - Uses Google Gemini AI to analyze GitHub profiles, LinkedIn, and projects
- **Professional Resume Generation** - Creates ATS-friendly resumes with AI enhancements
- **Expertise Reports** - Detailed skill assessments and career recommendations
- **PDF Export** - Download resumes as professional PDF documents
- **User Authentication** - Secure login/register system with JWT tokens
- **MongoDB Integration** - Scalable database for user data and resumes
- **Responsive Design** - Works perfectly on desktop and mobile devices

## 🚀 Live Demo

- **Frontend**: https://femqpacm.manus.space
- **Backend API**: https://5000-idnwnc62sil9757pzr2y0-a7e414d6.manusvm.computer

## 🛠️ Technology Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Flask** with Python 3.11
- **MongoDB** with PyMongo
- **JWT Authentication** with Flask-JWT-Extended
- **Google Gemini AI** for profile analysis
- **ReportLab** for PDF generation
- **Flask-CORS** for cross-origin requests

### AI Integration
- **Google Gemini Pro** for natural language processing
- **GitHub API** for repository analysis
- **Custom AI prompts** for resume and expertise generation

## 📁 Project Structure

```
ai-resume-saas/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   └── App.jsx         # Main application component
│   ├── dist/               # Production build
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Flask backend application
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI and business logic
│   │   └── main.py         # Flask application entry point
│   ├── venv/               # Python virtual environment
│   └── requirements.txt    # Backend dependencies
│
└── README.md               # This file
```

## 🔧 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Update the MongoDB connection string and Gemini API key in:
   - `src/database/config.py` - MongoDB connection
   - `src/services/ai_service.py` - Gemini API key

5. **Run the backend server**
   ```bash
   python src/main.py
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or npm run dev
   ```
   Frontend will start on `http://localhost:5173`

4. **Build for production**
   ```bash
   pnpm run build
   # or npm run build
   ```

## 🔑 API Configuration

### MongoDB Connection
The application uses MongoDB Atlas with the following connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

### Gemini AI API
The application integrates with Google's Gemini Pro model for AI analysis:
```python
GEMINI_API_KEY = "your-gemini-api-key"
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Profile Management
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update profile
- `PUT /api/profile` - Update profile

### Resume Generation
- `GET /api/resume/` - Get all user resumes
- `POST /api/resume/generate` - Generate new resume with AI
- `GET /api/resume/<id>` - Get specific resume
- `GET /api/resume/<id>/download` - Download resume as PDF
- `GET /api/resume/<id>/expertise` - Get expertise report

### Health Check
- `GET /api/health` - API health status

## 🎨 UI Features

### Modern Design Elements
- **Solana-inspired color scheme** with purple/teal gradients
- **Glass morphism effects** for cards and modals
- **Smooth animations** and hover effects
- **Responsive grid layouts** for all screen sizes
- **Dark theme** optimized for professional use

### User Experience
- **Intuitive navigation** with clear call-to-actions
- **Real-time form validation** with visual feedback
- **Loading states** for all async operations
- **Error handling** with user-friendly messages
- **Progressive disclosure** of complex forms

## 🤖 AI Analysis Features

### GitHub Profile Analysis
- Repository analysis and language detection
- Code quality assessment
- Project complexity scoring
- Contribution pattern analysis

### LinkedIn Integration
- Professional network assessment
- Industry presence evaluation
- Career development recommendations

### Project Analysis
- Technology stack diversity
- Innovation and creativity scoring
- Project quality assessment
- Improvement suggestions

### Resume Enhancement
- Professional summary generation
- Skill proficiency levels
- Achievement highlighting
- ATS optimization

### Expertise Reports
- Overall expertise scoring (0-100)
- Individual skill assessments
- Strength identification
- Improvement areas
- Learning path recommendations

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using bcrypt
- **CORS protection** for API endpoints
- **Input validation** and sanitization
- **Secure MongoDB connections** with authentication

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Frontend Deployment
The frontend is deployed as a static React application and can be hosted on:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Backend Deployment
The backend Flask application can be deployed on:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Any Python hosting service

### Environment Variables for Production
```bash
# Backend
MONGODB_URI=your-mongodb-connection-string
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=production

# Frontend
VITE_API_URL=your-backend-api-url
```

## 📝 Usage Guide

### For Users

1. **Registration**
   - Visit the application homepage
   - Click "Get Started" or "Sign Up"
   - Fill in username, email, and password
   - Verify email (if email verification is enabled)

2. **Profile Setup**
   - Add GitHub profile URL
   - Add LinkedIn profile URL
   - Add project repository links
   - Fill in skills, experience, and education

3. **Resume Generation**
   - Click "Generate Resume" from dashboard
   - AI analyzes your profiles and projects
   - Review generated resume and expertise report
   - Download as PDF or make edits

4. **Expertise Analysis**
   - View detailed skill assessments
   - Check overall expertise score
   - Review strengths and improvement areas
   - Follow learning recommendations

### For Developers

1. **Extending AI Analysis**
   - Modify prompts in `src/services/ai_service.py`
   - Add new analysis methods
   - Integrate additional APIs (Twitter, Stack Overflow, etc.)

2. **Customizing UI**
   - Update color schemes in `src/App.css`
   - Modify component styles in individual files
   - Add new animations and effects

3. **Adding Features**
   - Create new API endpoints in `src/routes/`
   - Add corresponding frontend components
   - Update database models as needed

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify network access in MongoDB Atlas
   - Ensure correct username/password

2. **Gemini API Errors**
   - Verify API key is correct
   - Check API quota and billing
   - Review rate limiting

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check for version conflicts
   - Update dependencies

4. **CORS Issues**
   - Verify backend CORS configuration
   - Check frontend API URL configuration
   - Ensure proper headers are set

## 📄 License

This project is created for demonstration purposes. Please ensure you have proper licenses for:
- Google Gemini AI usage
- MongoDB Atlas usage
- Any third-party libraries used

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

---

**Built with ❤️ using React, Flask, and Google Gemini AI**

