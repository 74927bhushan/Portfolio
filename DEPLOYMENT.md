# DEPLOYMENT GUIDE - Bhushan Choudhary Portfolio

## Quick Start Deployment (5 Minutes)

### Step 1: Initialize Git Repository
```bash
cd e:\antigravity\portfolio
git init
git add .
git commit -m "Initial portfolio website"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `portfolio` or `bhushanchoudhary.github.io`
3. Make it Public
4. DO NOT initialize with README (we already have files)
5. Click "Create repository"

### Step 3: Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/74927bhushan/portfolio.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 2-3 minutes for deployment
7. Your site will be live at: `https://74927bhushan.github.io/portfolio/`

## Custom Domain Setup (Optional)

### Buy a Domain (~$10-15/year)
Recommended registrars:
- **Namecheap** - https://namecheap.com
- **GoDaddy** - https://godaddy.com
- **Google Domains** - https://domains.google
- **Porkbun** - https://porkbun.com (cheapest)

### Configure DNS for GitHub Pages

1. **In your domain registrar's DNS settings:**
   - Add A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Add CNAME record: `www` → `74927bhushan.github.io`

2. **Update CNAME file in repository:**
   - Edit the `CNAME` file
   - Replace with your domain (e.g., `bhushanchoudhary.com`)
   - Commit and push changes

3. **Enable HTTPS in GitHub Pages:**
   - Go to Settings → Pages
   - Check "Enforce HTTPS"
   - Wait for SSL certificate (takes 10-30 minutes)

## Alternative: Deploy to Netlify (Easier with Custom Domain)

### Benefits
- Free hosting
- Automatic HTTPS
- Simpler DNS configuration
- Form handling
- Continuous deployment

### Steps
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Click "Deploy"
6. Your site is live at: `random-name.netlify.app`

### Add Custom Domain on Netlify
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Netlify automatically provisions SSL

## Deployment Checklist

### Before Deploying
- [x] All files created (HTML, CSS, JS, images)
- [x] Profile image added
- [x] All links work (GitHub, LinkedIn, Email)
- [ ] Test locally by opening index.html in browser
- [ ] Check responsive design on mobile
- [ ] Verify all sections display correctly

### After Deploying
- [ ] Test live website on different devices
- [ ] Check all external links work
- [ ] Verify images load correctly
- [ ] Test contact links (email, phone)
- [ ] Check SEO with Google Search Console
- [ ] Share on LinkedIn and social media

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Domain Name | $10-15/year | Only recurring cost |
| GitHub Pages Hosting | FREE | Unlimited bandwidth |
| SSL Certificate | FREE | Auto-renewed |
| Netlify Hosting | FREE | Alternative to GitHub Pages |
| **Total First Year** | **$10-15** | Then $10-15/year for domain |

## Updating Your Portfolio

To make changes after deployment:

```bash
# 1. Make your changes to the files
# 2. Commit changes
git add .
git commit -m "Updated experience section"

# 3. Push to GitHub
git push origin main

# 4. GitHub Pages will auto-deploy in 1-2 minutes
```

## Need Help?

If you encounter any issues:
1. Check GitHub Pages deployment status in Settings → Pages
2. Verify DNS propagation: https://dnschecker.org
3. Clear browser cache and try again
4. Check GitHub Actions tab for build errors

## Next Steps

1. **SEO Optimization:**
   - Submit sitemap to Google Search Console
   - Add Google Analytics (optional)
   - Optimize meta tags

2. **Social Sharing:**
   - Share on LinkedIn
   - Add to GitHub profile README
   - Include in email signature

3. **Continuous Updates:**
   - Add new projects as you build them
   - Update skills section regularly
   - Keep experience section current

---

**Your portfolio is ready to deploy! 🚀**

Follow the steps above, and you'll have a professional website live in less than 10 minutes!
