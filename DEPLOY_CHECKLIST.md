# 🚀 5-Minute Deployment Checklist

## Before You Deploy

- [ ] App runs locally (both frontend and backend)
- [ ] No console errors
- [ ] Mock data loads correctly
- [ ] All navigation works

---

## Deploy to Render (Recommended - FREE)

### Step 1: Push to GitHub (30 seconds)

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main

# Create repo at: https://github.com/new
# Then:
git remote add origin https://github.com/YOUR_USERNAME/departure-optimization.git
git push -u origin main
```

### Step 2: Deploy Backend (2 minutes)

1. Go to https://render.com (sign in with GitHub)
2. Click "New +" → "Web Service"
3. Select your repo
4. Fill in:
   - **Name:** `departure-optimization-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Free plan**
5. Add environment variable:
   - `NODE_ENV` = `production`
6. Click "Create Web Service"
7. **Copy the URL** (e.g., `https://departure-optimization-api.onrender.com`)

### Step 3: Deploy Frontend (2 minutes)

1. Click "New +" → "Static Site"
2. Select same repo
3. Fill in:
   - **Name:** `departure-optimization`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://departure-optimization-api.onrender.com` (from Step 2)
5. Click "Create Static Site"

### Step 4: Test (30 seconds)

1. Visit your frontend URL
2. Select "Galapagos Classic 8-Day" from dropdown
3. See 30 departure cards
4. Click on a departure - should show details
5. **Works?** ✅ You're done!

---

## Alternative: Railway (Even Simpler - $5/month)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select repo
4. Railway auto-detects everything
5. Done! 🎉

**No configuration needed** - Railway reads Docker Compose automatically.

---

## Alternative: Vercel (Best Performance)

### Backend on Render (Free)
- Follow Step 2 above

### Frontend on Vercel (Free + Fast CDN)

```bash
npm install -g vercel
cd frontend
vercel --prod
```

When prompted:
- Set `VITE_API_URL` to your Render backend URL

---

## Environment Variables Summary

**Backend:**
- `NODE_ENV` = `production`
- `PORT` = (auto-set by host)

**Frontend:**
- `VITE_API_URL` = Your backend URL (e.g., `https://departure-optimization-api.onrender.com`)

---

## Common Issues

### Backend won't start
**Fix:** Make sure `backend/package.json` has:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### Frontend shows "Failed to fetch"
**Fix:** 
1. Check VITE_API_URL environment variable is set
2. Make sure backend URL doesn't have trailing slash
3. Wait for backend to wake up (first request takes 30s on free tier)

### Data not showing
**Fix:** Backend generates mock data on first start. Wait 10 seconds after deployment, then refresh.

---

## What Happens After Push?

**Auto-Deploy:**
- Every `git push` triggers automatic deployment
- Backend redeploys in ~2 minutes
- Frontend redeploys in ~1 minute
- Zero downtime (Render serves old version until new is ready)

---

## URLs to Share

After deployment, you'll have:
- **Demo site:** `https://departure-optimization.onrender.com`
- **API docs:** `https://departure-optimization-api.onrender.com/health`

Share the demo site URL with G Adventures! 🎉

---

## Cost Summary

**Free Forever:**
- ✅ Backend sleeps after 15 min (perfect for demos)
- ✅ Frontend always on
- ✅ 100GB bandwidth
- ✅ Auto-deploys from GitHub
- ✅ SSL included
- **Total: $0/month**

**Production ($7/month):**
- ✅ Backend always on (no sleep)
- ✅ Faster deploys
- ✅ Custom domain support

---

## Next Steps

- [ ] Share link with stakeholders
- [ ] Add custom domain (optional)
- [ ] Monitor usage in Render dashboard
- [ ] Connect to real Kaptio data (Phase 2)

---

**Time to deployment: 5 minutes**  
**Cost: $0**  
**Difficulty: Copy + paste**

Let's go! 🚀

