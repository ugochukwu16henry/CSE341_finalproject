# Fix: Missing required parameter: scope

## Error: `Error 400: invalid_request - Missing required parameter: scope`

This error occurs when Google OAuth doesn't receive the scope parameter. Here's how to fix it:

---

## Solution 1: Verify OAuth Client Type in Google Cloud Console

The OAuth client must be configured as a **"Web application"** type:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Click on your OAuth 2.0 Client ID

2. **Check Application Type**
   - Make sure it says **"Web application"** (not "Desktop app" or "Mobile app")
   - If it's not "Web application", you may need to create a new OAuth client

3. **Verify Authorized Redirect URIs**
   - Ensure these are added EXACTLY:
     ```
     https://cse341-finalproject-pow9.onrender.com/auth/google/callback
     http://localhost:5000/auth/google/callback
     ```

---

## Solution 2: Check Environment Variables on Render

Make sure your Render environment variables are set correctly:

1. **Go to Render Dashboard**
   - Select your service
   - Go to "Environment" tab

2. **Verify these variables exist:**
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   BASE_URL=https://cse341-finalproject-pow9.onrender.com
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Important:** 
   - No quotes around values
   - No spaces before/after the `=`
   - `BASE_URL` should NOT have a trailing slash

---

## Solution 3: Restart Your Render Service

After updating environment variables:

1. Go to Render dashboard
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Wait for deployment to complete
4. Try OAuth again

---

## Solution 4: Verify OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Visit: https://console.cloud.google.com/apis/credentials/consent
   - Make sure your app is published or in testing mode
   - Add your email to "Test users" if in testing mode

2. **Required Scopes**
   - Make sure these scopes are added:
     - `.../auth/userinfo.profile`
     - `.../auth/userinfo.email`

---

## Solution 5: Check the Actual Request

To debug, check what URL is being generated:

1. Visit: `https://cse341-finalproject-pow9.onrender.com/auth/google`
2. Look at the browser's Network tab
3. Check the redirect URL - it should include `scope=profile+email`

If the scope is missing from the URL, the issue is in the code.
If the scope is present, the issue is in Google Cloud Console configuration.

---

## Common Issues

### Issue 1: OAuth Client is "Desktop App" Type
**Fix:** Create a new OAuth 2.0 Client ID and select "Web application"

### Issue 2: Environment Variables Not Loaded
**Fix:** Restart Render service after adding environment variables

### Issue 3: Wrong BASE_URL Format
**Fix:** 
- ✅ Correct: `BASE_URL=https://cse341-finalproject-pow9.onrender.com`
- ❌ Wrong: `BASE_URL=https://cse341-finalproject-pow9.onrender.com/`
- ❌ Wrong: `BASE_URL="https://cse341-finalproject-pow9.onrender.com"`

### Issue 4: OAuth Consent Screen Not Configured
**Fix:** Complete the OAuth Consent Screen setup in Google Cloud Console

---

## Quick Checklist

- [ ] OAuth Client is "Web application" type
- [ ] Authorized redirect URI added: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
- [ ] Environment variables set on Render (no quotes, no trailing slash)
- [ ] Render service restarted after environment variable changes
- [ ] OAuth Consent Screen configured
- [ ] Test user added (if in testing mode)
- [ ] Scopes added to consent screen (profile, email)

---

## Still Not Working?

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for the callback URL log message
   - Verify it matches what's in Google Cloud Console

2. **Test Locally First:**
   - Set up local `.env` file
   - Test OAuth locally
   - If local works but production doesn't, it's an environment variable issue

3. **Create New OAuth Client:**
   - Sometimes creating a fresh OAuth client resolves issues
   - Make sure to select "Web application" type
   - Add the redirect URIs immediately

