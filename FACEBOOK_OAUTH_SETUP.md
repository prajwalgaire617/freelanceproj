# Facebook OAuth Setup Guide

## 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as the app type
4. Fill in your app details:
   - App Name: WorkLab
   - App Contact Email: your-email@example.com
5. Click "Create App"

## 2. Configure Facebook Login

1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" as the platform
4. Enter your Site URL: `http://localhost:5173` (for development)
5. Click "Save" and "Continue"

## 3. Configure OAuth Settings

1. Go to "Facebook Login" → "Settings" in the left sidebar
2. Add the following to "Valid OAuth Redirect URIs":
   - `http://localhost:3000/api/auth/facebook/callback` (for development)
   - `https://yourdomain.com/api/auth/facebook/callback` (for production)
3. Save changes

## 4. Get Your App Credentials

1. Go to "Settings" → "Basic" in the left sidebar
2. Copy your "App ID" and "App Secret"
3. Add these to your `.env` file:

```env
# Facebook OAuth Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback
```

## 5. App Review (For Production)

**Note:** For development, your app works in "Development Mode" with test users only.

For production:
1. Go to "App Review" → "Permissions and Features"
2. Request "email" permission (usually auto-approved)
3. Complete Business Verification if required
4. Switch app to "Live Mode" in "Settings" → "Basic"

## 6. Test the Integration

1. Make sure your backend server is running: `npm run dev`
2. Make sure your frontend is running: `cd frontend && npm run dev`
3. Go to `http://localhost:5173/login`
4. Click "Continue with Facebook"
5. Complete the OAuth flow
6. You should be redirected back and logged in

## 7. Features Implemented

- ✅ Facebook OAuth signup/login
- ✅ Session-based authentication (single session per user)
- ✅ Automatic user creation with freelancer profile
- ✅ 20 free connects for new OAuth users
- ✅ Profile picture import from Facebook
- ✅ Email linking (if user exists with same email)
- ✅ Proper logout functionality
- ✅ Session management and invalidation

## 8. User Flow

1. User clicks "Continue with Facebook"
2. Redirected to Facebook OAuth consent screen
3. User authorizes the application
4. Facebook redirects back to `/api/auth/facebook/callback`
5. Backend creates/finds user and creates session
6. User is redirected to frontend with session data
7. Frontend stores session and redirects to appropriate dashboard

## 9. Security Features

- Single session per user (new login invalidates old sessions)
- Session-based JWT tokens with server-side validation
- Proper session cleanup on logout
- OAuth state validation (handled by Passport.js)
- Profile fields validation

## 10. Troubleshooting

### "App Not Setup" Error
- Make sure Facebook Login product is added to your app
- Verify OAuth redirect URIs are correctly configured
- Check that your app is in Development or Live mode

### "Invalid OAuth Redirect URI" Error
- Ensure the callback URL in `.env` matches exactly with Facebook settings
- Include protocol (http:// or https://)
- No trailing slashes

### Email Not Provided
- Some users may deny email permission
- App falls back to `{facebookId}@facebook.com` if email not provided
- Request "email" permission in App Review for production

### Testing with Test Users
- In Development Mode, create test users in "Roles" → "Test Users"
- Or add your Facebook account as a test user
- Regular users can't login until app is Live

## 11. Environment Variables Summary

Add these to your `.env` file:

```env
# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Other required variables
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:3000
```

## 12. Database Schema

The User model already includes the `facebookId` field:

```javascript
facebookId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
}
```

No database migration needed - the field already exists!
