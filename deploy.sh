#!/bin/bash

# Aesop Blog Deployment Script for GitHub Pages
# This script deploys the built aesop-blog to the gh-pages branch

set -e  # Exit on error

echo "🚀 Starting Aesop Blog deployment to GitHub Pages..."

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Make sure we're on the feature branch
if [[ "$CURRENT_BRANCH" != "claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV" ]]; then
  echo "⚠️  Switching to feature branch..."
  git checkout claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV
fi

# Check if dist folder exists
if [ ! -d "aesop-blog/dist" ]; then
  echo "❌ dist folder not found. Building..."
  cd aesop-blog
  npm run build
  cd ..
fi

echo "✅ Build files found"

# Copy dist to temporary location
echo "📦 Copying build files..."
rm -rf /tmp/aesop-blog-dist
cp -r aesop-blog/dist /tmp/aesop-blog-dist

# Switch to gh-pages
echo "🔄 Switching to gh-pages branch..."
git checkout gh-pages

# Clear aesop-blog directory and copy new files
echo "🗑️  Clearing old files..."
rm -rf aesop-blog/*

echo "📝 Copying new build..."
cp -r /tmp/aesop-blog-dist/* aesop-blog/

# Stage changes
echo "➕ Staging changes..."
git add aesop-blog/

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "ℹ️  No changes to deploy"
  git checkout "$CURRENT_BRANCH"
  exit 0
fi

# Commit
echo "💾 Committing changes..."
git commit -m "deploy: Update aesop-blog with adorable fox logo and light text colors

- Fox logo with warm colors (no blue)
- Elegant AE connection in AESOP text
- All dark text converted to light colors on blue cards
- Vite config updated with correct base path

Deployed from: $CURRENT_BRANCH
Date: $(date +'%Y-%m-%d %H:%M:%S')

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to gh-pages
echo "⬆️  Pushing to gh-pages..."
git push origin gh-pages

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app will be live in 1-2 minutes at:"
echo "   https://jessyutingtan.github.io/www.sherlock.stanford.edu/aesop-blog/"
echo ""
echo "💡 Tip: Clear your browser cache (Ctrl+Shift+R) if you don't see changes"

# Return to original branch
git checkout "$CURRENT_BRANCH"
echo "✅ Returned to $CURRENT_BRANCH"
