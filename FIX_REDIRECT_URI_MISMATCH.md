# Fix: redirect_uri_mismatch Error

## The Problem

Google is rejecting your OAuth request because the redirect URI doesn't match what's registered in Google Cloud Console.

---

## Step-by-Step Fix

### Step 1: Find Your Exact Callback URL

Your app uses this callback URL:
```
https://cse341-finalproject-pow9.onrender.com/auth/google/callback
```

**Important Details:**
- Protocol: `https://` (not `http://`)
- Domain: `cse341-finalproject-pow9.onrender.com`
- Path: `/auth/google/callback` (no trailing slash)
- No query parameters

---

### Step 2: Go to Google Cloud Console

1. **Visit:** https://console.cloud.google.com/
2. **Select your project** (or create one if needed)
3. **Navigate to:** APIs & Services → Credentials
   - Click "APIs & Services" in the left menu
   - Click "Credentials"

---

### Step 3: Edit Your OAuth 2.0 Client

1. **Find your OAuth 2.0 Client ID**
   - Look for "OAuth 2.0 Client IDs" section
   - Click on your client (or create a new one if needed)

2. **Check Application Type**
   - Must be **"Web application"** (not Desktop app or Mobile app)
   - If it's not, you need to create a new one

3. **Scroll to "Authorized redirect URIs"**

4. **Check if this EXACT URL exists:**
   ```
   https://cse341-finalproject-pow9.onrender.com/auth/google/callback
   ```

5. **If it's missing or different:**
   - Click "ADD URI" button
   - Type EXACTLY: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
   - **DO NOT:**
     - Add a trailing slash: `/auth/google/callback/` ❌
     - Use http instead of https: `http://...` ❌
     - Add extra parameters: `/auth/google/callback?param=value` ❌
     - Add spaces before/after ❌

6. **Also add localhost for testing (optional but recommended):**
   ```
   http://localhost:5000/auth/google/callback
   ```

7. **Click "SAVE"** at the bottom

---

### Step 4: Verify Render Environment Variables

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Select your service

2. **Go to Environment tab**

3. **Check these variables exist:**
   ```
   BASE_URL=https://cse341-finalproject-pow9.onrender.com
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

4. **Common Mistakes to Avoid:**
   - ❌ `BASE_URL=https://cse341-finalproject-pow9.onrender.com/` (trailing slash)
   - ❌ `BASE_URL="https://cse341-finalproject-pow9.onrender.com"` (quotes)
   - ❌ `BASE_URL = https://...` (spaces around =)
   - ❌ Missing `BASE_URL` variable

5. **If BASE_URL is wrong or missing:**
   - Click "Add Environment Variable"
   - Key: `BASE_URL`
   - Value: `https://cse341-finalproject-pow9.onrender.com` (no quotes, no trailing slash)
   - Click "Save Changes"

---

### Step 5: Wait and Redeploy

1. **Wait 5-10 minutes** after updating Google Cloud Console
   - Google's changes can take time to propagate

2. **Redeploy on Render:**
   - Go to Render Dashboard → Your Service
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for deployment to complete

---

### Step 6: Test Again

1. **Clear your browser cache** or use Incognito/Private mode
2. **Visit:** `https://cse341-finalproject-pow9.onrender.com/auth/google`
3. **You should be redirected to Google login**
4. **After login, you should be redirected back successfully**

---

## Common Issues

### Issue 1: Trailing Slash
**Wrong:** `https://...onrender.com/auth/google/callback/`  
**Correct:** `https://...onrender.com/auth/google/callback`

### Issue 2: HTTP vs HTTPS
**Wrong:** `http://cse341-finalproject-pow9.onrender.com/auth/google/callback`  
**Correct:** `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`

### Issue 3: Wrong Application Type
**Problem:** OAuth client is "Desktop app" instead of "Web application"  
**Solution:** Create a new OAuth 2.0 Client ID and select "Web application"

### Issue 4: BASE_URL Not Set
**Problem:** `BASE_URL` environment variable missing in Render  
**Solution:** Add `BASE_URL=https://cse341-finalproject-pow9.onrender.com` to Render environment variables

---

## Verification Checklist

- [ ] OAuth Client is "Web application" type
- [ ] Redirect URI added: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
- [ ] No trailing slash in redirect URI
- [ ] Using `https://` (not `http://`)
- [ ] `BASE_URL` set in Render: `https://cse341-finalproject-pow9.onrender.com`
- [ ] No quotes around `BASE_URL` value
- [ ] No trailing slash in `BASE_URL`
- [ ] Waited 5-10 minutes after updating Google Cloud Console
- [ ] Redeployed on Render after environment variable changes
- [ ] Testing with fresh browser session (incognito/cleared cache)

---

## Still Not Working?

1. **Double-check character-by-character:**
   - Compare the redirect URI in Google Cloud Console
   - With what's shown in Render logs: `🔐 Google OAuth Callback URL:`
   - They must match EXACTLY

2. **Check Render Logs:**
   - Look for: `🔐 Google OAuth Callback URL:`
   - Copy that exact URL
   - Make sure it's in Google Cloud Console

3. **Create Fresh OAuth Client:**
   - Sometimes starting fresh helps
   - Create new OAuth 2.0 Client ID
   - Select "Web application"
   - Add redirect URI immediately
   - Update Render environment variables

---

## Quick Reference

**Your Callback URL (must match exactly):**
```
https://cse341-finalproject-pow9.onrender.com/auth/google/callback
```

**Render Environment Variable:**
```
BASE_URL=https://cse341-finalproject-pow9.onrender.com
```

**Google Cloud Console Location:**
```
APIs & Services → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs
```

