# Environment Variables Setup Guide

Since `.env` files are protected by `.gitignore` for security, here's exactly what you need to create them manually.

## 🔧 Backend Environment File

**Location:** `backend/.env`

**Create it:**
```bash
cd backend
nano .env  # or use any text editor
```

**Contents:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Gemini API Key (REQUIRED)
# Get from: https://aistudio.google.com/apikey
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE

# MongoDB Configuration
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/story-arc-engine

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/story-arc-engine?retryWrites=true&w=majority

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes:**
- Replace `YOUR_ACTUAL_GEMINI_API_KEY_HERE` with your real API key
- For MongoDB Atlas, replace `username`, `password`, and `cluster` with your actual values
- Keep this file secret - never commit to Git!

## 🎨 Frontend Environment File

**Location:** `.env.local` (in project root)

**Create it:**
```bash
# From project root
nano .env.local  # or use any text editor
```

**Contents:**
```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Optional: User ID for tracking (can be generated client-side)
# VITE_USER_ID=
```

**Important Notes:**
- Only variables prefixed with `VITE_` are exposed to the frontend
- No sensitive data should go here
- Change `VITE_API_BASE_URL` to your production backend URL when deploying

## 📋 Quick Copy-Paste Templates

### Template 1: Local MongoDB
**backend/.env:**
```
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=YOUR_KEY_HERE
MONGODB_URI=mongodb://localhost:27017/story-arc-engine
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**.env.local:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Template 2: MongoDB Atlas (Cloud)
**backend/.env:**
```
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=YOUR_KEY_HERE
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/story-arc-engine
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**.env.local:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🔑 Getting Your API Keys

### Gemini API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `backend/.env` as `GEMINI_API_KEY`

**Required Models:**
- ✅ gemini-2.5-pro
- ✅ gemini-2.5-flash
- ✅ gemini-2.5-flash-image
- ✅ veo-3.1-fast-generate-preview

### MongoDB URI

#### Option A: Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/story-arc-engine
```

**Setup:**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt install mongodb
sudo systemctl start mongodb

# Verify
mongosh  # Should connect
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Use it as `MONGODB_URI`

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/story-arc-engine
```

## ✅ Verification

### Check Backend .env
```bash
cd backend
cat .env
```
Should show your configuration (never share this!)

### Check Frontend .env.local
```bash
cat .env.local
```
Should show API URL

### Test Configuration
```bash
# Start backend
cd backend
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Story Arc Engine Backend Server
# Status: Running
# Port: 5000
```

## 🚨 Common Mistakes

### ❌ Wrong: API Key in Frontend
```env
# .env.local (WRONG!)
GEMINI_API_KEY=abc123...  # ❌ INSECURE!
```

### ✅ Correct: API Key in Backend
```env
# backend/.env (CORRECT!)
GEMINI_API_KEY=abc123...  # ✅ SECURE!
```

### ❌ Wrong: Missing VITE_ Prefix
```env
# .env.local (WRONG!)
API_BASE_URL=http://localhost:5000/api  # ❌ Won't work!
```

### ✅ Correct: With VITE_ Prefix
```env
# .env.local (CORRECT!)
VITE_API_BASE_URL=http://localhost:5000/api  # ✅ Works!
```

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] Never commit `.env` files to Git
- [ ] Never share API keys publicly
- [ ] Use different keys for dev/production
- [ ] Keep `backend/.env` secret
- [ ] `.env.local` can be less sensitive (no API keys!)

## 🌍 Production Environment

### Backend (e.g., Railway, Render)
Set environment variables in the platform dashboard:
```
PORT=5000
NODE_ENV=production
GEMINI_API_KEY=your_production_key
MONGODB_URI=mongodb+srv://...  # Use Atlas in production
FRONTEND_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (e.g., Vercel, Netlify)
Set environment variables in the platform dashboard:
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

## 🛠️ Alternative: Use Setup Script

For interactive setup, use the provided script:
```bash
./setup-env.sh
```

This will guide you through creating both environment files.

## 📞 Troubleshooting

### "GEMINI_API_KEY not set"
- Check `backend/.env` exists
- Verify the key is correctly pasted
- No quotes around the key needed

### "MongoDB connection failed"
- Check MongoDB is running: `mongosh`
- Verify connection string
- Check network access (for Atlas)

### "Failed to fetch" in Frontend
- Check backend is running
- Verify `VITE_API_BASE_URL` in `.env.local`
- Ensure CORS allows frontend URL

## 🎉 You're Ready!

Once both files are created with correct values:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Create your first story!

---

**Remember:** The `.env` files are critical for security and configuration. Keep them safe and never share them publicly!

