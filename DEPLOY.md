# MVC Creations — Deployment Guide
# Mac Terminal · Git · Vercel
# ────────────────────────────────────────────────────────

## STEP 1: Move the project to your Mac

If you downloaded the zip, unzip it and move to your desired location:
  cd ~/Desktop
  unzip mvc-creations.zip   # or wherever Claude saved it
  cd mvc-creations

## STEP 2: Install dependencies

  npm install

## STEP 3: Run locally to preview

  npm run dev
  # Open http://localhost:3000 in your browser

## STEP 4: Initialize a Git repo

  git init
  git add .
  git commit -m "Initial commit — MVC Creations landing page"

## STEP 5: Create a GitHub repo and push

  # Option A — GitHub CLI (if installed: brew install gh)
  gh repo create mvc-creations --public --source=. --remote=origin --push

  # Option B — Manual (go to github.com/new, create repo, then):
  git remote add origin https://github.com/YOUR_USERNAME/mvc-creations.git
  git branch -M main
  git push -u origin main

## STEP 6: Deploy to Vercel

  # Option A — Vercel CLI
  npm install -g vercel
  vercel          # Follow prompts: link to your account, deploy
  vercel --prod   # Promote to production

  # Option B — Vercel Dashboard (easiest)
  # 1. Go to vercel.com → New Project
  # 2. Import your GitHub repo
  # 3. Framework: Next.js (auto-detected)
  # 4. Click Deploy → done in ~60 seconds

## STEP 7: Add environment variables on Vercel

  # In Vercel dashboard → Your Project → Settings → Environment Variables
  # Add any from .env.local.example that you're using:
  NEXT_PUBLIC_SITE_URL=https://your-domain.com

## STEP 8: Connect your custom domain (optional)

  # Vercel dashboard → Your Project → Settings → Domains
  # Add mvccreations.com (or your domain) and follow DNS instructions

## ────────────────────────────────────────────────────────
## NEXT STEPS (post-launch TODOs)
## ────────────────────────────────────────────────────────

  1. ACUITY: In components/BookingCTA.tsx, replace the placeholder div
     with the iframe embed Acuity provides in your account settings.

  2. SHOPIFY: In components/ShopPreview.tsx, replace the mockProducts
     array with a fetch to your Shopify Storefront API.
     Env vars needed: SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN

  3. PHOTOS: Replace all Unsplash placeholder images with real nail photos.
     Drop them in /public/images/ and update the src props.

  4. BUILD OUT STUB PAGES: Each page in /app/(about|services|shop|gallery|book)
     has a stub. Use the homepage sections as templates to build them out.

## ────────────────────────────────────────────────────────
## USEFUL COMMANDS
## ────────────────────────────────────────────────────────

  npm run dev      # Local dev server (hot reload)
  npm run build    # Production build
  npm run start    # Serve production build locally
  npm run lint     # Check for linting issues

  git add .
  git commit -m "your message"
  git push         # Vercel auto-deploys on push to main
