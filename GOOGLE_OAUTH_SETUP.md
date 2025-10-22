# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)

## 2. Configure Environment Variables

Create a `.env` file in your project root with:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Other required variables
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:3000
```

## 3. Test the Integration

1. Start your backend server: `npm run dev`
2. Start your frontend: `npm run dev` (in frontend directory)
3. Go to `http://localhost:5173/login`
4. Click "Continue with Google"
5. Complete the OAuth flow
6. You should be redirected back and logged in

## 4. Features Implemented

- ✅ Google OAuth signup/login
- ✅ Session-based authentication (single session per user)
- ✅ Automatic user creation with freelancer profile
- ✅ 20 free connects for new OAuth users
- ✅ Proper logout functionality
- ✅ Session management and invalidation

## 5. User Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/api/auth/google/callback`
5. Backend creates/finds user and creates session
6. User is redirected to frontend with session data
7. Frontend stores session and redirects to appropriate dashboard

## 6. Security Features

- Single session per user (new login invalidates old sessions)
- Session-based JWT tokens with server-side validation
- Proper session cleanup on logout
- OAuth state validation (handled by Passport.js)

