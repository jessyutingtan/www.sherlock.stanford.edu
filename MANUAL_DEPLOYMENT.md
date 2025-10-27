# Manual Deployment Instructions

## If GitHub Actions Workflow Doesn't Trigger

If the automated workflow isn't working, you can build and deploy manually:

---

## Step 1: Set Up Environment Variables

Create a file called `.env` in the `aesop-blog/` folder:

```bash
cd aesop-blog
nano .env
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 2: Install Dependencies and Build

```bash
# Make sure you're in the aesop-blog folder
cd /path/to/www.sherlock.stanford.edu/aesop-blog

# Install dependencies
npm install

# Build the application
npm run build
```

This creates a `dist/` folder with the built application.

---

## Step 3: Deploy to gh-pages Branch

```bash
# Go back to repository root
cd ..

# Switch to gh-pages branch (create if doesn't exist)
git checkout gh-pages || git checkout --orphan gh-pages

# Remove all existing files
git rm -rf .
git clean -fxd

# Copy built files from aesop-blog/dist
cp -r aesop-blog/dist/* .

# Create .nojekyll file (tells GitHub Pages not to use Jekyll)
touch .nojekyll

# Add all files
git add -A

# Commit
git commit -m "Deploy Aesop Blog manually"

# Push to gh-pages
git push origin gh-pages --force
```

---

## Step 4: Configure GitHub Pages

1. Go to: https://github.com/jessyutingtan/www.sherlock.stanford.edu/settings/pages

2. Under "Build and deployment":
   - Source: **"Deploy from a branch"**
   - Branch: **`gh-pages`**
   - Folder: **`/ (root)`**
   - Click **"Save"**

---

## Step 5: Wait and Verify

1. Wait 2-3 minutes for GitHub Pages to deploy
2. Visit: https://jessyutingtan.github.io/www.sherlock.stanford.edu/
3. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

---

## Troubleshooting

### If you see "supabaseUrl is required" error:

Make sure you created the `.env` file in step 1 with the correct values before building.

### If assets don't load (404 errors):

Check that `vite.config.ts` has:
```typescript
base: '/www.sherlock.stanford.edu/',
```

### If the site is still blank:

1. Open browser console (F12)
2. Check for errors
3. Verify the build completed without errors
4. Make sure you're on the correct URL

---

## Alternative: Use Workflow (Automated)

If you want to use the automated workflow instead:

1. Make sure GitHub Actions is enabled in your repository
2. Verify the secrets are set:
   - Go to Settings → Secrets and variables → Actions
   - Add: `VITE_SUPABASE_URL`
   - Add: `VITE_SUPABASE_ANON_KEY`
3. Push any change to the `claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV` branch
4. Check: https://github.com/jessyutingtan/www.sherlock.stanford.edu/actions

---

## Quick Manual Deploy Script

Save this as `deploy.sh` in the repository root:

```bash
#!/bin/bash
set -e

echo "Building Aesop Blog..."
cd aesop-blog
npm install
npm run build
cd ..

echo "Deploying to gh-pages..."
git checkout gh-pages || git checkout --orphan gh-pages
git rm -rf . || true
git clean -fxd
cp -r aesop-blog/dist/* .
touch .nojekyll
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages --force

echo "Switching back to feature branch..."
git checkout claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV

echo "Done! Visit https://jessyutingtan.github.io/www.sherlock.stanford.edu/ in 2-3 minutes"
```

Make it executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

**Remember:** Always set GitHub Pages to deploy from the `gh-pages` branch, not the feature branch!
