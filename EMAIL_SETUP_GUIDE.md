# Email Setup Guide for OTP Verification

## 1. Gmail SMTP Configuration

### Enable App Passwords for Gmail:
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to Security → App passwords
5. Generate a new app password for "Mail"
6. Copy the 16-character app password

### Configure Environment Variables:
Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Other required variables
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:3000
```

## 2. Features Implemented

### ✅ **OTP-Based Email Verification**
- 6-digit OTP sent via email
- 10-minute expiration
- Rate limiting (max 3 resend attempts per hour)
- Beautiful HTML email templates
- Automatic welcome email after verification

### ✅ **Enhanced Forgot Password**
- OTP-based password reset
- Secure 6-digit codes
- Rate limiting protection
- Step-by-step password reset flow

### ✅ **Frontend Components**
- `OTPVerification.tsx` - OTP input with auto-focus
- `NewPasswordForm.tsx` - Password reset form
- `ForgotPassword.tsx` - Complete forgot password flow
- Integrated with login/register forms

### ✅ **Security Features**
- Rate limiting on OTP requests
- OTP attempt tracking
- Automatic cleanup of expired OTPs
- Secure password validation

## 3. User Flow

### **Registration Flow:**
1. User registers → OTP sent to email
2. User enters OTP → Email verified
3. Welcome email sent → User logged in

### **Login Flow:**
1. User logs in → If email not verified, OTP verification shown
2. User enters OTP → Email verified → User logged in

### **Forgot Password Flow:**
1. User enters email → OTP sent
2. User enters OTP → New password form shown
3. User sets new password → Password reset complete

## 4. API Endpoints

### **Email Verification:**
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification` - Resend verification OTP

### **Password Reset:**
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

## 5. Email Templates

### **Verification OTP Email:**
- Professional design with WorkLab branding
- Clear 6-digit OTP display
- 10-minute expiration notice
- Security tips

### **Password Reset OTP Email:**
- Red-themed design for security
- Clear reset instructions
- 10-minute expiration notice
- Security warnings

### **Welcome Email:**
- Congratulations message
- 20 free connects bonus highlighted
- Next steps based on user type
- Call-to-action button

## 6. Testing

### **Test the System:**
```bash
# Test OTP functionality
node test-otp.js

# Test email configuration
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### **Frontend Testing:**
1. Go to `http://localhost:5173/register`
2. Register with a real email address
3. Check email for OTP
4. Enter OTP to verify
5. Test forgot password flow

## 7. Security Considerations

- **Rate Limiting:** Max 3 OTP requests per hour per user
- **OTP Expiration:** 10 minutes for all OTPs
- **Attempt Tracking:** Max 5 OTP attempts before lockout
- **Email Validation:** Proper email format validation
- **Password Security:** Minimum 6 characters required

## 8. Troubleshooting

### **Email Not Sending:**
1. Check Gmail app password is correct
2. Verify 2-step verification is enabled
3. Check spam folder
4. Test with a different email provider

### **OTP Not Working:**
1. Check database connection
2. Verify OTP fields in database
3. Check server logs for errors
4. Test with a fresh user registration

### **Frontend Issues:**
1. Check API endpoints are accessible
2. Verify CORS configuration
3. Check browser console for errors
4. Test with different browsers

## 9. Production Deployment

### **Environment Variables:**
```env
EMAIL_USER=your-production-email@domain.com
EMAIL_PASS=your-production-app-password
CLIENT_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### **Email Service Alternatives:**
- **SendGrid:** For high-volume email sending
- **AWS SES:** For AWS-based applications
- **Mailgun:** For developer-friendly email API
- **Postmark:** For transactional emails

The OTP email verification system is now fully implemented and ready for use! 🎉

