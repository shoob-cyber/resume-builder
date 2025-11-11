# 📄 Resume Builder - Modern Full-Stack Application

<div align="center">

![Resume Builder](https://img.shields.io/badge/Resume-Builder-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A stunning, modern resume builder with animated UI and dynamic sections**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Resume Builder is a full-stack MERN application that allows users to create, edit, and manage professional resumes with a modern, animated user interface. Built with React, Node.js, Express, and MongoDB, it features real-time preview, dynamic sections, and beautiful animations powered by Framer Motion.

### ✨ Key Highlights

- 🎨 **Modern UI/UX**: Glassmorphism design with smooth animations
- ⚡ **Real-time Preview**: See changes instantly as you type
- 🔄 **Dynamic Sections**: Add/remove multiple entries for skills, experience, and education
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 💾 **Cloud Storage**: Store unlimited resumes in MongoDB
- 🎭 **Animated Interactions**: Smooth transitions and micro-interactions
- 🎯 **Section Navigation**: Easy tab-based navigation between resume sections

---

## 🚀 Features

### Frontend Features
- ✅ Create and edit multiple resumes
- ✅ Dynamic form sections with add/remove functionality
- ✅ Live resume preview
- ✅ Beautiful animations using Framer Motion
- ✅ Glassmorphism and gradient designs
- ✅ Entry counters for each section
- ✅ Form validation
- ✅ Responsive layout

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ CRUD operations for resumes
- ✅ Error handling
- ✅ CORS enabled
- ✅ Data validation with Mongoose

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.x** | UI library for building components |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Axios** | HTTP client for API requests |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **CORS** | Cross-origin resource sharing |

### Design & Fonts
- **Inter Font** (Google Fonts)
- **Glassmorphism** UI style
- **Gradient Backgrounds**

---

## 📁 Project Structure

```
resume-builder/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   └── resumeController.js   # Resume CRUD logic
│   ├── models/
│   │   └── Resume.js             # Resume schema
│   ├── routes/
│   │   └── resumeRoutes.js       # API routes
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeForm.jsx    # Main form component
│   │   │   ├── ResumePreview.jsx # Live preview component
│   │   │   └── ResumeList.jsx    # Resume list component
│   │   ├── App.jsx               # Root component
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── postcss.config.js         # PostCSS configuration
│   └── package.json
│
└── README.md
```

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** (optional)

### Step-by-Step Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shoob-cyber/resume-builder
cd resume-builder
```

Or download the ZIP file and extract it.

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional - for custom configuration)
# Add your MongoDB connection string if using MongoDB Atlas
echo "MONGO_URI=mongodb://localhost:27017/resume-builder" > .env
echo "PORT=5000" >> .env
```

**Backend Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "cors": "^2.8.5"
}
```

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install
```

**Frontend Dependencies:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0",
  "framer-motion": "^11.0.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

#### 4️⃣ Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `backend/config/db.js` with your connection string

---

## 🎯 Usage Guide

### Starting the Application

#### 1️⃣ Start Backend Server

```bash
# From backend directory
cd backend
npm start
```

✅ Server will start at: `http://localhost:5000`

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

#### 2️⃣ Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

✅ Frontend will start at: `http://localhost:5173`

**Expected Output:**
```
ROLLDOWN-VITE v7.2.2  ready in 200 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 3️⃣ Open Application

Open your browser and navigate to: `http://localhost:5173`

---

## 📘 User Guide

### Creating Your First Resume

#### Step 1: Home Screen
- Click the **"Create New Resume"** button (animated gradient button)
- You'll be taken to the resume builder interface

#### Step 2: Personal Information
1. Fill in your basic details:
   - Full Name (required)
   - Email (required)
   - Phone Number
   - Address
   - LinkedIn URL
   - Website/Portfolio

2. Navigate between sections using the tab buttons at the top

#### Step 3: Professional Summary
1. Click the **"Summary"** tab
2. Write a brief professional summary (2-3 paragraphs recommended)
3. Highlight your key achievements and skills

#### Step 4: Add Work Experience
1. Click the **"Experience"** tab
2. Click **"+ Add Experience"** button
3. For each job entry, fill in:
   - Company Name
   - Job Position
   - Start Date (month/year)
   - End Date or check "Currently working here"
   - Job Description
4. Click **"+ Add Experience"** again to add more jobs
5. Use **"Remove Entry"** to delete unwanted entries

#### Step 5: Add Education
1. Click the **"Education"** tab
2. Click **"+ Add Education"** button
3. For each education entry:
   - Institution Name
   - Degree
   - Field of Study
   - Start Date & End Date
   - GPA (optional)
4. Add multiple degrees as needed

#### Step 6: Add Skills
1. Click the **"Skills"** tab
2. Click **"+ Add Skill"** button multiple times
3. Type each skill in the input field
4. Skills will appear as animated badges in the preview
5. Remove skills using the X button on each skill card

#### Step 7: Save Resume
1. Click **"Create Resume"** or **"Update Resume"** button at the bottom
2. Wait for the success animation
3. You'll be redirected to the resume list

### Managing Resumes

#### View All Resumes
- From the home screen, see all your saved resumes
- Each card shows:
  - Resume owner's name and initials
  - Email address
  - Last updated date
  - Status badge

#### Edit Resume
1. Click the **"Edit"** button on any resume card
2. Make your changes in the form
3. See live updates in the preview pane
4. Click **"Update Resume"** to save changes

#### Delete Resume
1. Click the **"Delete"** button on any resume card
2. Confirm deletion in the popup
3. Resume will be permanently removed

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api/resumes
```

### Endpoints

#### 1. Create Resume
```http
POST /api/resumes
Content-Type: application/json

{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "linkedin": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com"
  },
  "summary": "Professional summary...",
  "experience": [...],
  "education": [...],
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "personalInfo": {...},
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Get All Resumes
```http
GET /api/resumes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "personalInfo": {...},
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 3. Get Single Resume
```http
GET /api/resumes/:id
```

#### 4. Update Resume
```http
PUT /api/resumes/:id
Content-Type: application/json

{
  "personalInfo": {...},
  "summary": "Updated summary..."
}
```

#### 5. Delete Resume
```http
DELETE /api/resumes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## 🎨 Features Breakdown

### 1. Dynamic Form Sections
- **Add/Remove Entries**: Click "+" buttons to add new items
- **Entry Counters**: See how many items you've added
- **Numbered Badges**: Each entry shows its position
- **Color-Coded**: Different colors for different sections

### 2. Animation System
- **Page Transitions**: Smooth fade and slide effects
- **Card Hover Effects**: Cards lift on hover
- **Button Interactions**: Scale and glow animations
- **Loading States**: Animated spinners
- **Entry Animations**: Fade-in when adding, slide-out when removing

### 3. Live Preview
- **Real-time Updates**: Changes reflect instantly
- **Professional Layout**: Clean, resume-style formatting
- **Section Indicators**: Show count of entries
- **Download Ready**: Preview shows final output

### 4. Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Tablet Support**: Adapts layout for medium screens
- **Desktop Enhanced**: Multi-column layout on large screens

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend won't start
```bash
# Check if MongoDB is running
# Windows:
sc query MongoDB

# macOS/Linux:
systemctl status mongod
```

**Solution**: Start MongoDB service

#### 2. Frontend shows "Cannot connect to server"
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify API_URL in frontend components

#### 3. Framer Motion import errors
```bash
# Reinstall framer-motion
cd frontend
npm install framer-motion
```

#### 4. Tailwind styles not working
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
```

#### 5. MongoDB connection failed
- Check MongoDB is running
- Verify connection string in `backend/config/db.js`
- Check network/firewall settings

---

## 🔒 Environment Variables

Create `.env` files for configuration:

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-builder
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)
```bash
# Add to package.json
"scripts": {
  "start": "node server.js"
}

# Set environment variables on hosting platform
MONGO_URI=your_mongodb_atlas_uri
PORT=5000
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variable
VITE_API_URL=your_backend_url
```

---

## 📸 Screenshots

### Home Screen
*Beautiful glassmorphism design with resume cards*

### Resume Builder
*Split-screen editor with live preview*

### Dynamic Sections
*Add multiple experiences, education, and skills*

### Mobile View
*Fully responsive on all devices*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@shoob-cyber](https://github.com/shoob-cyber)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Build Tool

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Contact: sahabuddin.seikh28@gmail.com

---

<div align="center">

**⭐ If you find this project helpful, please give it a star!**

Made with ❤️ by **Shoob-cyber**

</div>
