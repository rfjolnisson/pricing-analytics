#!/bin/bash

echo "🚀 Preparing Departure Revenue Optimization for Deployment"
echo "=========================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if files are staged
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit (already clean)"
else
    echo "📝 Adding files to git..."
    git add .
    echo "✅ Files staged"
    
    echo ""
    echo "💾 Creating commit..."
    git commit -m "Ready for deployment - Departure Revenue Optimization Platform"
    echo "✅ Commit created"
fi

echo ""
echo "=========================================================="
echo "✅ Repository ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repo at: https://github.com/new"
echo "   Suggested name: departure-optimization"
echo ""
echo "2. Run these commands (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/departure-optimization.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Render (FREE):"
echo "   • Go to https://render.com"
echo "   • Sign in with GitHub"
echo "   • Follow DEPLOY_CHECKLIST.md"
echo ""
echo "⏱️  Total time to live: ~5 minutes"
echo "💰 Cost: \$0 (free tier)"
echo ""
echo "🎉 Good luck with the demo!"
echo ""

