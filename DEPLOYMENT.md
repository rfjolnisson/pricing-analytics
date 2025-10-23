# Deployment Guide - Render (5 Minutes) 🚀

## Why Render?
- ✅ **Free tier** (no credit card required)
- ✅ **Auto-deploy** from GitHub on every push
- ✅ **Zero config** - just point and click
- ✅ **Both services** deployed from one repo
- ✅ **Custom domains** supported

---

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Departure Revenue Optimization"

# Create repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/departure-optimization.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend API (1 minute)

1. **Go to:** https://render.com
2. **Sign in** with GitHub
3. **Click:** "New +" → "Web Service"
4. **Select:** Your GitHub repo
5. **Configure:**
   - **Name:** `departure-optimization-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Instance Type:** `Free`

6. **Add Environment Variable:**
   - Key: `NODE_ENV`
   - Value: `production`

7. **Click:** "Create Web Service"

8. **Copy the URL** (e.g., `https://departure-optimization-api.onrender.com`)

---

## Step 3: Deploy Frontend (1 minute)

1. **Click:** "New +" → "Static Site"
2. **Select:** Same GitHub repo
3. **Configure:**
   - **Name:** `departure-optimization`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://departure-optimization-api.onrender.com` (URL from Step 2)

5. **Click:** "Create Static Site"

6. **Copy the URL** (e.g., `https://departure-optimization.onrender.com`)

---

## Step 4: Update Frontend to Use API URL (1 minute)

Update `frontend/src/utils/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3013';
```

Push to GitHub:

```bash
git add frontend/src/utils/api.ts
git commit -m "Use environment variable for API URL"
git push
```

**Render will auto-deploy the change!** ✨

---

## That's It! 🎉

Your app is now live at:
- **Frontend:** `https://departure-optimization.onrender.com`
- **Backend:** `https://departure-optimization-api.onrender.com`

Every git push will automatically trigger a new deployment.

---

## Alternative: One-Click Deploy (Even Easier!)

Click this button after pushing to GitHub:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Render will read the `render.yaml` file and set everything up automatically.

---

## Free Tier Limitations

**Backend:**
- Spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Perfect for demos and POCs

**Frontend:**
- Always on, instant load
- 100GB bandwidth/month (plenty for demos)

**Upgrade to Paid ($7/month):**
- Backend stays awake 24/7
- Faster builds
- Custom domains

---

## Alternative Hosting Options

### Railway (Also Great)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select repo
4. Railway auto-detects and deploys both services
5. **Cost:** $5/month (includes both services)

### Vercel + Render (Split)

- **Frontend on Vercel** (faster CDN for React)
- **Backend on Render** (free tier)
- More setup, but better performance

### Docker (Self-Hosted)

```bash
# Use the existing Docker Compose setup
docker-compose up -d

# Deploy to any VPS (DigitalOcean, AWS, etc.)
```

---

## Troubleshooting

### Backend build fails
```bash
# Make sure backend has a build script in package.json
cd backend
npm run build
```

### Frontend can't reach backend
- Check VITE_API_URL environment variable
- Make sure backend is deployed first
- Check backend URL ends without trailing slash

### Data not persisting
- Free tier uses ephemeral storage
- Data regenerates on each deploy (perfect for demos)
- For production, add PostgreSQL database

---

## Next Steps After Deployment

1. **Share the link** with G Adventures
2. **Custom domain:** Add `departure-optimization.goadventures.com`
3. **Analytics:** Add Google Analytics tracking
4. **Authentication:** Add login for production use
5. **Real data:** Connect to Kaptio via EdgeTokens

---

## Cost Summary

**Demo/POC (Free Forever):**
- Backend: Free (sleeps after 15 min)
- Frontend: Free (100GB bandwidth)
- **Total: $0/month**

**Production (Always On):**
- Backend: $7/month
- Frontend: Free
- **Total: $7/month**

---

**You're 5 minutes away from a live demo. Let's go! 🚀**

