# Fix: TokenError: Bad Request / Unauthorized

## Error Analysis

The error `TokenError: Bad Request` or `TokenError: Unauthorized` occurs when Google rejects the token exchange request. This happens **after** the user successfully authorizes, but **before** we get the access token.

---

## Root Causes

### 1. Redirect URI Mismatch (Most Common)
The redirect URI used in the token exchange must **exactly match** what's registered in Google Cloud Console.

### 2. Wrong Client Secret
The client secret in your environment variables doesn't match Google Cloud Console.

### 3. Authorization Code Already Used
OAuth authorization codes are single-use. If you refresh the page or try again with the same code, it will fail.

---

## Step-by-Step Fix

### Step 1: Verify Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Click on your OAuth 2.0 Client ID

2. **Check Authorized Redirect URIs**
   - Look for: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
   - **CRITICAL:** It must match EXACTLY:
     - ✅ Correct: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
     - ❌ Wrong: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback/` (trailing slash)
     - ❌ Wrong: `http://cse341-finalproject-pow9.onrender.com/auth/google/callback` (http instead of https)
     - ❌ Wrong: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback?param=value` (extra params)

3. **If the URI is missing or wrong:**
   - Click "ADD URI"
   - Enter: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
   - Click "SAVE"
   - **Wait 5-10 minutes** for changes to propagate

---

### Step 2: Verify Render Environment Variables

1. **Go to Render Dashboard**
   - Select your service
   - Go to "Environment" tab

2. **Check these variables:**

   ```
   BASE_URL=https://cse341-finalproject-pow9.onrender.com
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

3. **Common Mistakes:**
   - ❌ `BASE_URL=https://cse341-finalproject-pow9.onrender.com/` (trailing slash)
   - ❌ `BASE_URL="https://cse341-finalproject-pow9.onrender.com"` (quotes)
   - ❌ `BASE_URL = https://cse341-finalproject-pow9.onrender.com` (spaces around =)
   - ❌ Missing `BASE_URL` entirely

4. **Verify Client Secret:**
   - Go back to Google Cloud Console
   - Click on your OAuth Client ID
   - Click "Reset Secret" if you're unsure
   - Copy the NEW secret
   - Update it in Render environment variables
   - **Important:** Old secrets become invalid immediately

---

### Step 3: Clear and Redeploy

1. **After making changes:**
   - Go to Render Dashboard
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for deployment to complete

2. **Check Logs:**
   - Look for: `🔐 Google OAuth Callback URL:`
   - Verify it shows: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`

---

### Step 4: Test with Fresh Authorization

1. **Clear Browser Cache** or use Incognito mode
2. **Visit:** `https://cse341-finalproject-pow9.onrender.com/auth/google`
3. **Complete Google login**
4. **Check Render logs** for any errors

---

## Debugging Checklist

- [ ] Redirect URI in Google Cloud Console matches exactly (no trailing slash, https not http)
- [ ] `BASE_URL` environment variable is set correctly in Render
- [ ] `GOOGLE_CLIENT_ID` matches Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` matches Google Cloud Console (or was reset)
- [ ] Render service was redeployed after environment variable changes
- [ ] Waited 5-10 minutes after updating Google Cloud Console
- [ ] Testing with fresh browser session (incognito/cleared cache)
- [ ] OAuth Client is "Web application" type (not Desktop app)

---

## Common Issues

### Issue 1: Redirect URI Has Trailing Slash
**Symptom:** TokenError: Bad Request  
**Fix:** Remove trailing slash from Google Cloud Console redirect URI

### Issue 2: HTTP vs HTTPS Mismatch
**Symptom:** TokenError: Unauthorized  
**Fix:** Ensure both use `https://` (production) or both use `http://` (local)

### Issue 3: Client Secret Changed
**Symptom:** TokenError: Unauthorized  
**Fix:** Reset secret in Google Cloud Console and update Render environment variable

### Issue 4: Authorization Code Reused
**Symptom:** TokenError: Bad Request  
**Fix:** Start fresh OAuth flow (don't refresh callback page)

---

## Still Not Working?

1. **Check Render Logs:**
   - Look for the exact callback URL being used
   - Compare it character-by-character with Google Cloud Console

2. **Create New OAuth Client:**
   - Sometimes starting fresh resolves issues
   - Create new OAuth 2.0 Client ID
   - Select "Web application"
   - Add redirect URI immediately
   - Update Render environment variables

3. **Test Locally First:**
   - Set up local `.env` file
   - Test OAuth locally
   - If local works but production doesn't, it's an environment variable issue

---

## Quick Test

After fixing, the logs should show:
```
🔐 Google OAuth Callback URL: https://cse341-finalproject-pow9.onrender.com/auth/google/callback
🔍 Google OAuth Profile: { id: '...', email: '...', name: '...' }
✨ Creating new user from Google profile
👤 User authenticated: ... ...
```

If you see these logs, OAuth is working! ✅

