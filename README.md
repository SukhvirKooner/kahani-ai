<div align="center">

</div>

# Story Arc Engine

An AI-powered children's animation platform that transforms drawings and stories into animated videos using Google's Gemini AI.

View the original app in AI Studio: https://ai.studio/apps/drive/136eOQ07rzrIOF4Sm8pUqnuwljMTs6D_q

## 🎯 Features

- 🎨 **Story Generation**: Create complete production plans from character descriptions
- 🖼️ **Image Generation**: Generate character models and keyframes using Gemini AI
- 🎬 **Video Creation**: Animate keyframes into 32-second video stories
- 💬 **Character Chat**: Interactive conversations with story characters
- 🗄️ **Data Persistence**: Store and retrieve stories with MongoDB
- 🔒 **Secure Architecture**: Backend proxy protects API keys from exposure

## 🏗️ Architecture

This project now includes both **frontend** and **backend** components:

### Frontend (React + Vite)
- User interface for creating and viewing stories
- Built with React 19 and TypeScript
- Communicates with backend API (no direct AI API calls)

### Backend (Node.js + Express)
- Secure API gateway for Gemini AI
- MongoDB integration for data persistence
- Handles all AI model interactions
- **Why Backend?** To prevent API key exposure and enable data persistence

```
Frontend (Port 5173) ←→ Backend (Port 5000) ←→ MongoDB + Gemini AI
```

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **MongoDB** (local or cloud)
- **Google Gemini API Key**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend** - Create `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/story-arc-engine
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

📝 **Note**: You can copy from the example files:
```bash
cp env.local.example .env.local
cd backend && cp env.example .env && cd ..
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI accordingly
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup instructions and troubleshooting
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🔧 Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- @google/genai (for types only)

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- Google Gemini AI SDK
- Helmet, CORS, Morgan

## 🗂️ Project Structure

```
story-arc-engine/
├── components/           # React components
├── services/
│   ├── geminiService.ts # OLD: Direct Gemini calls (deprecated)
│   └── apiService.ts    # NEW: Backend API client
├── backend/             # Backend server
│   └── src/
│       ├── controllers/ # Request handlers
│       ├── models/      # MongoDB schemas
│       ├── routes/      # API routes
│       ├── services/    # Gemini AI integration
│       └── server.ts    # Main server file
├── .env.local           # Frontend config
├── backend/.env         # Backend config (contains API key)
└── SETUP_GUIDE.md       # Detailed setup instructions
```

## 🔒 Security

### API Key Protection

- ✅ API keys stored **only** in backend `.env`
- ✅ Never exposed to frontend/browser
- ✅ All AI calls proxied through backend

### Why This Matters

Direct frontend API calls expose your keys to anyone who:
- Opens browser DevTools
- Inspects network requests
- Views compiled JavaScript

This can lead to:
- Unauthorized API usage
- Billing abuse
- Rate limit exhaustion

Our backend architecture prevents this entirely.

## 🎮 Usage

1. **Create a Story**
   - Describe a character or upload a drawing
   - Enter a parent's lesson/prompt
   - Select language
   - Click "Generate Story"

2. **View Results**
   - See the generated production plan
   - Watch character model creation
   - View generated keyframes
   - Watch animated video clips

3. **Interact**
   - Chat with the story character
   - All conversations saved to database

## 🐛 Troubleshooting

### Backend won't start
- Check if GEMINI_API_KEY is set in `backend/.env`
- Verify MongoDB is running
- Ensure port 5000 is available

### Frontend can't connect to backend
- Verify backend is running: http://localhost:5000/health
- Check VITE_API_URL in `.env.local`
- Verify CORS settings in `backend/.env`

### Node version issues
```bash
nvm install 20
nvm use 20
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

## 📦 Scripts

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # Development with hot-reload
npm run build    # TypeScript compilation
npm start        # Run production build
```

## 🌐 API Endpoints

```
POST   /api/production-plans          # Create production plan
GET    /api/production-plans/:id      # Get production plan
POST   /api/assets/character-model    # Generate character
POST   /api/assets/keyframe           # Generate keyframe
POST   /api/assets/video              # Generate video
POST   /api/chat                      # Send chat message
```

See [backend/README.md](backend/README.md) for complete API documentation.

## 🤝 Contributing

This is a portfolio/learning project showcasing:
- Full-stack TypeScript development
- AI API integration
- Secure architecture patterns
- MongoDB database design
- RESTful API design

## 📄 License

MIT

## 🙏 Acknowledgments

- Google Gemini AI for the powerful AI models
- AI Studio for the original inspiration
- MongoDB for reliable data persistence
