# Deploy Aesop Blog to GitHub Pages

Your aesop-blog app with the new adorable fox logo and light text colors is ready to deploy!

## Current Status

✅ **Feature Branch Updated**
- Branch: `claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV`
- Fox logo with warm colors (no blue)
- Elegant AE connection in AESOP text
- All dark text converted to light colors on blue cards
- Vite config updated with correct base path
- Built and ready to deploy

## Deployment Steps

### Option 1: Manual Deployment (Quick & Easy)

1. **Copy the built files to gh-pages branch:**
   ```bash
   cd /path/to/www.sherlock.stanford.edu

   # Switch to feature branch
   git checkout claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV

   # Copy dist folder to temp location
   cp -r aesop-blog/dist /tmp/aesop-blog-dist

   # Switch to gh-pages
   git checkout gh-pages

   # Clear and copy built files
   rm -rf aesop-blog/*
   cp -r /tmp/aesop-blog-dist/* aesop-blog/

   # Commit and push
   git add aesop-blog/
   git commit -m "deploy: Update aesop-blog with fox logo and light text"
   git push origin gh-pages
   ```

2. **Access your app at:**
   ```
   https://jessyutingtan.github.io/www.sherlock.stanford.edu/aesop-blog/
   ```

3. **Wait 1-2 minutes** for GitHub Pages to rebuild

### Option 2: GitHub Actions (Automated - Recommended)

Create a GitHub Actions workflow to automatically deploy when you push to the feature branch:

1. Create `.github/workflows/deploy.yml` in your repository:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - claude/build-social-blog-platform-*
       paths:
         - 'aesop-blog/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: cd aesop-blog && npm install

         - name: Build
           run: cd aesop-blog && npm run build

         - name: Deploy to gh-pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./aesop-blog/dist
             destination_dir: aesop-blog
   ```

2. Push this workflow file to your repository
3. Every push to the feature branch will automatically deploy!

## What Was Changed

### 1. **Logo - Adorable Fox** (aesop-blog/src/components/Logo.tsx)
   - Removed all blue colors
   - Created cute fox with:
     - Pointy ears with cream inner details
     - Round head with orange gradient
     - White cheek patches
     - Cream snout with red nose
     - Big eyes with highlights
     - Cute smile
     - Fluffy tail with white tip
     - Small paws

### 2. **AESOP Text - Elegant AE Link**
   - SVG overlay with golden gradient line
   - Connects A and E elegantly

### 3. **Card Text Colors** (aesop-blog/src/index.css)
   - All text-gray-900/800/700 → white
   - All text-gray-600/500 → gray-300
   - All text-gray-400 → orange-300
   - Smart exceptions for light backgrounds

### 4. **Vite Config** (aesop-blog/vite.config.ts)
   - Updated base path to `/www.sherlock.stanford.edu/aesop-blog/`
   - Ensures proper asset loading on GitHub Pages

## Troubleshooting

**Issue:** App shows blank page or broken assets

**Solution:** Check that the base path in `vite.config.ts` matches your deployment location:
- Root deployment: `base: '/'`
- Subdirectory: `base: '/www.sherlock.stanford.edu/aesop-blog/'`

**Issue:** GitHub Pages not updating

**Solution:**
1. Check GitHub Actions tab for build errors
2. Clear browser cache (Ctrl+Shift+R)
3. Wait 2-3 minutes for CDN to update

## Next Steps

After deployment, test your app at:
```
https://jessyutingtan.github.io/www.sherlock.stanford.edu/aesop-blog/
```

You should see:
- ✅ Adorable orange/cream fox logo (no blue!)
- ✅ AESOP text with elegant AE connection
- ✅ White/light colored text on all blue cards
- ✅ Dark text only on light backgrounds (buttons, etc.)

---

**Need help?** The changes are all committed to the feature branch. You can review them before deploying!
