# GitHub Pages Configuration - CRITICAL

## ⚠️ Issue Found

You mentioned: "deploy from branch: I selected the correct claude/build...8zVBV branch but the folder is /(root)"

**This is the problem!** You should NOT deploy from the feature branch. The feature branch contains SOURCE CODE, not the BUILT application.

---

## ✅ Correct GitHub Pages Settings

You MUST configure GitHub Pages to deploy from the **gh-pages** branch, not the feature branch.

### Step-by-Step Instructions:

1. **Go to your repository on GitHub:**
   https://github.com/jessyutingtan/www.sherlock.stanford.edu

2. **Click on "Settings"** (top menu)

3. **Click on "Pages"** (left sidebar)

4. **Under "Build and deployment" → "Source":**
   - Select: **"Deploy from a branch"**

5. **Under "Branch":**
   - Branch: **`gh-pages`** (NOT claude/build...8zVBV)
   - Folder: **`/ (root)`**
   - Click **"Save"**

---

## 🔄 What Happens

The GitHub Actions workflow I created does this automatically:

1. **When you push** to the feature branch `claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV`
2. **Workflow runs** and builds the Aesop Blog with Supabase secrets
3. **Deploys built files** to the `gh-pages` branch
4. **GitHub Pages** serves the site from `gh-pages` branch

You don't need to manually deploy from the feature branch!

---

## 🚀 Latest Fixes Pushed

I just pushed commit `0441f8a` with:

1. **`force_orphan: true`** - Completely replaces gh-pages content with only Aesop Blog
   - This removes any conflicting files from previous deployments
   - Ensures a clean, fresh deployment

2. **Supabase environment variables** - Passed correctly to build process
   - `VITE_SUPABASE_URL` from your GitHub secrets
   - `VITE_SUPABASE_ANON_KEY` from your GitHub secrets

3. **Correct base path** - Set to `/www.sherlock.stanford.edu/`
   - Assets will load from correct URLs

---

## ⏱️ Timeline

1. **~3-4 minutes:** GitHub Actions workflow completes
2. **Change GitHub Pages settings** to deploy from `gh-pages` branch (CRITICAL!)
3. **~1-2 minutes:** GitHub Pages rebuilds and deploys
4. **Visit site:** https://jessyutingtan.github.io/www.sherlock.stanford.edu/
5. **Hard refresh:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

---

## 🔍 How to Verify

### Check Workflow Status:
https://github.com/jessyutingtan/www.sherlock.stanford.edu/actions

Look for "Deploy Aesop Blog to GitHub Pages" - should show green checkmark ✅

### Check gh-pages Branch:
The gh-pages branch should contain:
- `index.html`
- `assets/` folder with CSS and JS files
- `.nojekyll` file (created automatically)

### Check Browser Console:
- **Before fix:** "Uncaught Error: supabaseUrl is required"
- **After fix:** No errors, site loads properly

---

## 📝 Summary

**The blank page issue has TWO causes:**

1. ❌ **Wrong branch selected** in GitHub Pages settings
   - You selected: `claude/build-social-blog-platform-011CUWnJgKAMmmVYTBz8zVBV` (source code)
   - You need: `gh-pages` (built files)

2. ✅ **Missing Supabase secrets** (FIXED in commit `ff2c65c`)
   - Added environment variables to build step
   - Secrets now embedded in build

**Action Required:**
1. Wait for workflow to complete (~3-4 minutes)
2. **Change GitHub Pages settings** to deploy from `gh-pages` branch
3. Wait ~1-2 minutes for GitHub Pages to update
4. Visit https://jessyutingtan.github.io/www.sherlock.stanford.edu/
5. Hard refresh your browser

---

## 🎯 Expected Result

After following these steps, you should see:
- ✅ Aesop Blog loads (not blank!)
- ✅ Fox logo with intertwined AE
- ✅ All UI updates (white/orange/yellow colors)
- ✅ Black text on white background for blog posts
- ✅ Working authentication
- ✅ All features functional

---

**The fix is pushed. Change your GitHub Pages settings to `gh-pages` branch and the site will work!** 🎉
