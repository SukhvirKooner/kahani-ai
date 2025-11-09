# Story Arc Engine - Setup Checklist

Use this checklist to ensure everything is configured correctly before running the application.

## 📋 Pre-Installation Checklist

- [ ] **Node.js >= 20.0.0 installed**
  ```bash
  node --version
  # Should show v20.x.x or higher
  ```

- [ ] **MongoDB installed and accessible**
  - [ ] Local MongoDB running, OR
  - [ ] MongoDB Atlas account created

- [ ] **Google Gemini API Key obtained**
  - [ ] Visit https://ai.google.dev/
  - [ ] Generate API key
  - [ ] Save it securely

## 📦 Installation Checklist

- [ ] **Frontend dependencies installed**
  ```bash
  npm install
  ```

- [ ] **Backend dependencies installed**
  ```bash
  cd backend
  npm install
  cd ..
  ```

## ⚙️ Configuration Checklist

### Frontend Configuration

- [ ] **Created `.env.local` file in project root**
  ```bash
  cp env.local.example .env.local
  ```

- [ ] **Verified `.env.local` contains:**
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

### Backend Configuration

- [ ] **Created `backend/.env` file**
  ```bash
  cd backend
  cp env.example .env
  cd ..
  ```

- [ ] **Updated `backend/.env` with your values:**
  - [ ] `GEMINI_API_KEY` set to your actual API key
  - [ ] `MONGODB_URI` set correctly:
    - Local: `mongodb://localhost:27017/story-arc-engine`
    - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/story-arc-engine`
  - [ ] `PORT` set (default: 5000)
  - [ ] `FRONTEND_URL` set (default: http://localhost:5173)

## 🗄️ Database Checklist

### Local MongoDB

- [ ] **MongoDB is running**
  ```bash
  # Check if MongoDB is running
  pgrep mongod
  # or
  mongosh
  ```

- [ ] **Start MongoDB if not running (macOS)**
  ```bash
  brew services start mongodb-community
  ```

- [ ] **Start MongoDB if not running (Linux)**
  ```bash
  sudo systemctl start mongod
  ```

### MongoDB Atlas (Cloud)

- [ ] **Created MongoDB Atlas account**
- [ ] **Created a cluster (free tier)**
- [ ] **Whitelisted IP address (0.0.0.0/0 for development)**
- [ ] **Created database user with password**
- [ ] **Copied connection string to `backend/.env`**

## 🔧 Verification Checklist

### File Structure Check

- [ ] **Verify files exist:**
  - [ ] `.env.local` (in project root)
  - [ ] `backend/.env` (in backend folder)
  - [ ] `node_modules/` (in project root)
  - [ ] `backend/node_modules/` (in backend folder)

### Content Verification

- [ ] **Check `.env.local`:**
  ```bash
  cat .env.local
  # Should show VITE_API_URL=http://localhost:5000/api
  ```

- [ ] **Check `backend/.env`:**
  ```bash
  cat backend/.env
  # Should show your GEMINI_API_KEY (not "your_gemini_api_key_here")
  ```

## 🚀 Running the Application

### Option 1: Using the Start Script (Recommended)

- [ ] **Run the start script:**
  ```bash
  ./start.sh
  ```

- [ ] **Verify outputs:**
  - [ ] "✅ Backend running on http://localhost:5000"
  - [ ] "✅ Frontend running on http://localhost:5173"
  - [ ] "✅ MongoDB connected successfully" (in backend logs)

### Option 2: Manual Start

- [ ] **Start backend (Terminal 1):**
  ```bash
  cd backend
  npm run dev
  ```

- [ ] **Verify backend started:**
  - [ ] See "✅ MongoDB connected successfully"
  - [ ] See "🚀 Server is running on port 5000"

- [ ] **Start frontend (Terminal 2):**
  ```bash
  npm run dev
  ```

- [ ] **Verify frontend started:**
  - [ ] See "Local: http://localhost:5173/"

## ✅ Testing Checklist

### Backend Tests

- [ ] **Health check endpoint works:**
  ```bash
  curl http://localhost:5000/health
  # Should return: {"status":"ok",...}
  ```

- [ ] **API base URL accessible:**
  ```bash
  curl http://localhost:5000/api/production-plans
  # Should return JSON with success: true
  ```

### Frontend Tests

- [ ] **Open browser to http://localhost:5173**
- [ ] **Page loads without errors**
- [ ] **No console errors in browser DevTools (F12)**

### Integration Tests

- [ ] **Create a story:**
  - [ ] Enter character description
  - [ ] Enter parent prompt
  - [ ] Select language
  - [ ] Click "Generate Story"

- [ ] **Verify generation:**
  - [ ] Production plan displays
  - [ ] Character model generates
  - [ ] Keyframes generate
  - [ ] Videos generate (this takes time)

- [ ] **Check database:**
  ```bash
  mongosh
  use story-arc-engine
  db.productionplans.find().pretty()
  # Should show your generated plan
  ```

## 🐛 Troubleshooting Checklist

### If Backend Won't Start

- [ ] **Check MongoDB is running:**
  ```bash
  mongosh
  ```

- [ ] **Verify GEMINI_API_KEY is set:**
  ```bash
  cat backend/.env | grep GEMINI_API_KEY
  ```

- [ ] **Check port 5000 is free:**
  ```bash
  lsof -i :5000
  # If in use: kill -9 <PID>
  ```

- [ ] **Check backend logs:**
  ```bash
  cat backend.log
  # or
  cd backend && npm run dev
  # Watch console output
  ```

### If Frontend Won't Start

- [ ] **Check port 5173 is free:**
  ```bash
  lsof -i :5173
  ```

- [ ] **Verify .env.local exists:**
  ```bash
  ls -la .env.local
  ```

- [ ] **Check frontend logs:**
  ```bash
  cat frontend.log
  # or
  npm run dev
  # Watch console output
  ```

### If Frontend Can't Connect to Backend

- [ ] **Backend is running:**
  ```bash
  curl http://localhost:5000/health
  ```

- [ ] **CORS settings correct:**
  - [ ] `FRONTEND_URL` in `backend/.env` matches frontend URL
  - [ ] Default: `http://localhost:5173`

- [ ] **API URL correct:**
  - [ ] `VITE_API_URL` in `.env.local` is `http://localhost:5000/api`

### If API Keys Seem Exposed

- [ ] **Verify frontend uses `apiService.ts`:**
  ```bash
  grep -r "apiService" services/
  ```

- [ ] **Check App.tsx doesn't import `geminiService.ts` directly**

- [ ] **Inspect Network tab in browser:**
  - [ ] All AI calls go to `localhost:5000/api`
  - [ ] No calls to `generativelanguage.googleapis.com` from frontend

## 📚 Documentation Checklist

- [ ] **Read README.md** - Project overview
- [ ] **Read SETUP_GUIDE.md** - Detailed setup instructions
- [ ] **Read backend/README.md** - API documentation
- [ ] **Read PROJECT_SUMMARY.md** - Architecture overview

## 🎉 Success Criteria

You're ready when:

- [ ] Backend health check returns success
- [ ] Frontend loads in browser
- [ ] Can create a production plan
- [ ] Data appears in MongoDB
- [ ] No API keys visible in browser DevTools
- [ ] No errors in console/logs

## 📞 Need Help?

If you're stuck:

1. Check the troubleshooting sections in each README
2. Review the logs:
   - `backend.log` for backend issues
   - `frontend.log` for frontend issues
   - Browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Confirm Node.js version is >= 20.0.0

## 🎓 Next Steps

Once everything is working:

- [ ] Explore the API endpoints (see backend/README.md)
- [ ] Review the code structure
- [ ] Try the chat feature
- [ ] Experiment with different prompts
- [ ] Check MongoDB to see stored data

---

**Pro Tip**: Keep this checklist handy for future setups or when helping others get started!

✅ **All Done?** You're ready to create amazing AI-powered stories! 🚀

