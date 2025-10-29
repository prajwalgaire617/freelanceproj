# Auth: Email OTP Login + Forgot Password

This document covers the email-based OTP flows now available in the API and frontend.

## Backend endpoints

- POST `/api/auth/login/otp/request`
  - Body: `{ email: string }`
  - Sends a 6-digit one-time code to the email if the user exists (does not reveal account existence).

- POST `/api/auth/login/otp/verify`
  - Body: `{ email: string, otp: string }`
  - Verifies the code, starts a session, and returns `{ token, sessionId, expiresAt, user }`.

- POST `/api/auth/forgot-password`
  - Body: `{ email: string }`
  - Sends a password-reset OTP to the email.

- POST `/api/auth/reset-password`
  - Body: `{ email: string, otp: string, password: string }`
  - Resets the password if the OTP is valid and not expired.

- POST `/api/auth/verify-email`
  - Body: `{ email: string, otp: string }`
  - Verifies a new user's email address.

- POST `/api/auth/resend-verification`
  - Body: `{ email: string }`
  - Resends the verification OTP to unverified users.

## Rate limiting and security

- OTP requests are rate-limited per user: up to 3 sends per hour.
- OTP verification attempts: up to 5 attempts per hour.
- All OTPs expire after 10 minutes.
- OTP values are stored on the `users` table (`emailVerificationOTP`, `passwordResetOTP`, `loginOTP`) with paired expiry timestamps.

## Database changes

A migration adds fields for passwordless login:

- `loginOTP` (string, nullable)
- `loginOTPExpires` (datetime, nullable)

Run migrations:

```sh
npm run db:migrate
```

## Email configuration

Set the following environment variables:

- `EMAIL_USER` – Gmail address or SMTP user
- `EMAIL_PASS` – Gmail app password or SMTP password
- `CLIENT_URL` – Frontend base URL used in email templates
- `NOVU_API_KEY` – Optional, for in-app notifications

The app uses Nodemailer with Gmail by default. You can switch to a different transport in `src/services/emailService.js`.

## Frontend pages

- Passwordless login page: `GET /login/code`
  - Requests a login code and then verifies it with a 2-step UI.
- Forgot password page: `GET /forgot-password`
  - Requests a reset code, verifies it, then lets the user set a new password.

These use the shared component `frontend/src/components/OTPVerification.tsx`.

## Quick manual test

1) Start backend and frontend
2) Go to `/login/code`, enter a registered email, and submit
3) Enter the received code to sign in

Alternatively, from a terminal:

```sh
node test-login-otp.js
```

Note: For end-to-end automation, you can temporarily log OTPs on the server or use a testing inbox.
