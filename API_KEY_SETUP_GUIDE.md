# Gemini API Key Setup Guide

## 🔑 The Problem

You're getting a **403 PERMISSION_DENIED** error:
```
Method doesn't allow unregistered callers (callers without established identity). 
Please use API Key or other form of API consumer identity to call this API.
```

This means your API key either:
1. Doesn't have access to the required Gemini models
2. Isn't valid or has expired
3. Doesn't have billing enabled (some models require paid access)

## ✅ How to Get a Valid API Key

### Step 1: Get API Key from Google AI Studio

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/apikey
   - Sign in with your Google account

2. **Create a New API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - **Important:** Some models require billing to be enabled

3. **Copy Your API Key:**
   - It will look like: `AIzaSy...` (39 characters)
   - Keep it safe - don't share it publicly!

### Step 2: Check Required Model Access

Your Story Arc Engine needs access to these models:
- ✅ **gemini-2.5-pro** - For production plan generation
- ✅ **gemini-2.5-flash** - For chat functionality  
- ✅ **gemini-2.5-flash-image** - For character/keyframe generation
- ✅ **veo-3.1-fast-generate-preview** - For video generation

**Note:** Some of these models (especially Veo) may require:
- Billing enabled on your Google Cloud project
- Acceptance of terms of service
- Waiting for access approval

### Step 3: Alternative - Use Available Models Only

If you don't have access to all models, you can modify the code to use only available models:

**For Testing - Use Only Text Models:**
```typescript
// In backend/src/services/geminiService.ts
// Change model name from:
model: "gemini-2.5-pro"
// To:
model: "gemini-1.5-pro"  // or "gemini-pro"
```

## 🔧 How to Update Your API Key

### Method 1: Edit .env File Directly

```bash
cd /Users/sukhvirsingh/webdev/story-arc-engine/backend
nano .env
```

Update this line:
```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

Save and exit (Ctrl+X, then Y, then Enter)

### Method 2: Use Command Line

```bash
cd /Users/sukhvirsingh/webdev/story-arc-engine/backend

# Backup current .env
cp .env .env.backup

# Update API key
sed -i '' 's/GEMINI_API_KEY=.*/GEMINI_API_KEY=YOUR_NEW_KEY_HERE/' .env
```

## 🚀 Restart the Backend

After updating the API key, you MUST restart the backend:

```bash
# Stop the backend
pkill -f "tsx watch"

# Start it again
cd backend
npm run dev
```

## 🧪 Test Your API Key

### Quick Test Command:

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

If this works, your API key is valid!

## 📊 Check What Models You Have Access To

Create a test script to check available models:

```bash
cd /Users/sukhvirsingh/webdev/story-arc-engine/backend
cat > test-api-key.js << 'EOF'
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log('Testing Gemini API Key...\n');

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: 'Hello' }] }
    });
    console.log(`✅ ${modelName}: WORKS`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName}: FAILS -`, error.message);
    return false;
  }
}

async function main() {
  await testModel('gemini-pro');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-2.5-flash');
  await testModel('gemini-2.5-pro');
}

main();
EOF

node test-api-key.js
```

## 🔄 Alternative: Use Google Cloud Project API Key

If the AI Studio key doesn't work, you can create an API key through Google Cloud Console:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project:**
   - Create a new project or select existing one

3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search for "Generative Language API"
   - Click "Enable"

4. **Create Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

5. **Enable Billing (if needed):**
   - Some models require a billing account
   - Go to "Billing" and set up billing

## ⚠️ Common Issues

### Issue 1: "Billing not enabled"
**Solution:** Enable billing in Google Cloud Console
- Some models (especially Veo) require paid access

### Issue 2: "Model not found"
**Solution:** The model might not be available yet
- Try using `gemini-pro` or `gemini-1.5-pro` instead
- Wait for access to newer models

### Issue 3: "Quota exceeded"
**Solution:** You've hit the free tier limit
- Enable billing for higher quotas
- Or wait for quota to reset (usually daily)

### Issue 4: "API key restrictions"
**Solution:** Check API key restrictions in Cloud Console
- Make sure it's not restricted to specific IPs
- Make sure it has access to the Generative Language API

## 🎯 Recommended Approach for Development

### For Testing Without Video Generation:

Update `backend/src/services/geminiService.ts` to use simpler models:

```typescript
// Line ~194 - Change model
model: "gemini-1.5-pro"  // Instead of "gemini-2.5-pro"

// Line ~228 - For image generation, you might need to skip or mock it
// Line ~248 - For video generation, you might need to skip or mock it
```

This way you can test the basic functionality without needing access to all models.

## 📞 Get Help

If you continue having issues:

1. **Check Google AI Studio Status:**
   - https://status.cloud.google.com/

2. **Check Model Availability:**
   - Some models are in limited preview
   - May need to join waitlist

3. **Verify API Key:**
   - Make sure it's not expired
   - Check it's from the correct project

## ✅ Success Checklist

- [ ] Got API key from https://aistudio.google.com/apikey
- [ ] API key is 39 characters starting with `AIza`
- [ ] Updated `backend/.env` with new API key
- [ ] Restarted backend server
- [ ] Tested with curl or test script
- [ ] Backend shows: `✅ Initializing Gemini with API key (length: 39)`
- [ ] No more 403 errors

---

**Once you have a valid API key, your Story Arc Engine will work perfectly!** 🎉

