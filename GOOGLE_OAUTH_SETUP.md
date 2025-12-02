# Google OAuth Setup Guide
## Fixing redirect_uri_mismatch Error

### Error: `redirect_uri_mismatch`
This error occurs when the callback URL in your app doesn't match what's registered in Google Cloud Console.

---

## Step 1: Check Your Current Callback URL

Your app uses this callback URL format:
```
{BASE_URL}/auth/google/callback
```

Where `BASE_URL` comes from your `.env` file or defaults to:
- Production: `https://cse341-finalproject-pow9.onrender.com`
- Local: `http://localhost:5000`

---

## Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create a new one)

2. **Navigate to APIs & Services > Credentials**
   - Click on "APIs & Services" in the left menu
   - Click "Credentials"
   - Find your OAuth 2.0 Client ID (or create one if needed)

3. **Edit Your OAuth Client**
   - Click on your OAuth 2.0 Client ID
   - Scroll to "Authorized redirect URIs"
   - Click "ADD URI"

4. **Add ALL Required Redirect URIs**

   **For Local Development:**
   ```
   http://localhost:5000/auth/google/callback
   ```

   **For Production (Render):**
   ```
   https://cse341-finalproject-pow9.onrender.com/auth/google/callback
   ```

   **Important:** Add BOTH URIs if you're testing locally and deploying!

5. **Save Changes**
   - Click "SAVE" at the bottom

---

## Step 3: Update Your Environment Variables

### For Local Development (.env file):
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
BASE_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret_here
```

### For Production (Render Environment Variables):
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add/Update:
   - `GOOGLE_CLIENT_ID` = your_client_id
   - `GOOGLE_CLIENT_SECRET` = your_client_secret
   - `BASE_URL` = https://cse341-finalproject-pow9.onrender.com
   - `JWT_SECRET` = your_jwt_secret

---

## Step 4: Verify Your Callback URL

The callback URL must match EXACTLY (including protocol, domain, port, and path):

✅ **Correct Examples:**
- `http://localhost:5000/auth/google/callback`
- `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`

❌ **Incorrect Examples:**
- `http://localhost:5000/auth/google/callback/` (trailing slash)
- `http://localhost/auth/google/callback` (missing port)
- `https://localhost:5000/auth/google/callback` (wrong protocol)

---

## Step 5: Common Issues & Solutions

### Issue 1: Still Getting redirect_uri_mismatch
**Solution:** 
- Wait 5-10 minutes after updating Google Cloud Console (changes can take time to propagate)
- Clear your browser cache
- Try in an incognito/private window

### Issue 2: Different Port Numbers
**Solution:**
- Make sure your `BASE_URL` matches the exact port you're using
- If using port 3000 locally, update `.env`: `BASE_URL=http://localhost:3000`

### Issue 3: HTTPS vs HTTP
**Solution:**
- Local development: Use `http://`
- Production: Use `https://`
- Make sure both are added to Google Cloud Console

---

## Step 6: Test Your Setup

1. **Restart your server** after updating environment variables
2. **Visit:** `http://localhost:5000/auth/google` (or your production URL)
3. **You should be redirected to Google login**
4. **After login, you'll be redirected back** to your callback URL

---

## Quick Checklist

- [ ] OAuth 2.0 Client ID created in Google Cloud Console
- [ ] Authorized redirect URI added: `http://localhost:5000/auth/google/callback`
- [ ] Authorized redirect URI added: `https://cse341-finalproject-pow9.onrender.com/auth/google/callback`
- [ ] `.env` file has correct `BASE_URL` for local development
- [ ] Render environment variables have correct `BASE_URL` for production
- [ ] Server restarted after environment variable changes
- [ ] Tested the OAuth flow

---

## Need Help?

If you're still having issues:
1. Check the exact error message in Google Cloud Console (it shows the expected URI)
2. Compare it with what's in your `BASE_URL` environment variable
3. Make sure there are no trailing slashes or extra characters
4. Verify the protocol (http vs https) matches your environment

