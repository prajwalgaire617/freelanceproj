# Novu Setup Guide for WorkLab

This guide will help you set up Novu notifications for real-time alerts in the WorkLab application.

## Prerequisites

- Node.js installed
- Novu account (free tier available)
- Backend and frontend servers running

## Step 1: Create a Novu Account

1. Go to [https://novu.co](https://novu.co)
2. Sign up for a free account
3. Once logged in, you'll be redirected to the dashboard

## Step 2: Get Your API Keys

### Get Application Identifier (Frontend)

1. In the Novu dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API Keys**
3. Copy your **Application Identifier** (starts with something like `abc123...`)
4. Paste it in `/frontend/.env` as:
   ```
   VITE_NOVU_APP_ID=your_application_identifier_here
   ```

### Get API Key (Backend)

1. In the same **API Keys** page
2. Copy your **API Key** (this is a secret key)
3. Paste it in the root `.env` file as:
   ```
   NOVU_API_KEY=your_api_key_here
   ```

## Step 3: Create Notification Workflows

Novu uses **workflows** (previously called templates) to define what notifications to send.

### Create "New Message" Workflow

1. In Novu dashboard, click **Workflows** in the left sidebar
2. Click **Create Workflow** button
3. Choose **Blank Workflow**
4. Set the following:
   - **Workflow Identifier**: `new-message` (must match exactly!)
   - **Workflow Name**: New Message Notification
5. Click **Create Workflow**

6. **Add In-App Step:**
   - Click **Add Step** → Select **In-App**
   - Configure the notification:
     - **Subject**: `{{senderName}} sent you a message`
     - **Body**: `{{messageContent}}`
     - **Avatar**: `{{senderAvatar}}`
     - **Action URL**: `{{conversationUrl}}`
   - Click **Save**

7. Click **Activate** to enable the workflow

### Create "New Job Application" Workflow (Optional)

Repeat the above steps with:
- **Workflow Identifier**: `new-job-application`
- **Workflow Name**: New Job Application
- **In-App Configuration**:
  - **Subject**: `{{applicantName}} applied to your job`
  - **Body**: `Application for {{jobTitle}}`
  - **Avatar**: `{{applicantAvatar}}`
  - **Action URL**: `{{jobUrl}}`

### Create "New Contract" Workflow (Optional)

Repeat with:
- **Workflow Identifier**: `new-contract`
- **Workflow Name**: New Contract Created
- **In-App Configuration**:
  - **Subject**: `New contract from {{clientName}}`
  - **Body**: `{{projectTitle}} - ${{amount}}`
  - **Action URL**: `{{contractUrl}}`

## Step 4: Configure Environment Variables

### Backend (.env)
```properties
# Novu Configuration
NOVU_API_KEY=your_novu_api_key_here
```

### Frontend (frontend/.env)
```properties
# Novu Configuration
VITE_NOVU_APP_ID=your_novu_app_id_here
VITE_NOVU_BACKEND_URL=https://api.novu.co
VITE_NOVU_SOCKET_URL=https://ws.novu.co
```

## Step 5: Subscribe Users to Novu

When users log in, they need to be subscribed to Novu to receive notifications.

The subscription happens automatically when:
1. User logs in successfully
2. Frontend calls `/api/novu/subscribe` (done in AuthContext)

You can manually test subscription with:
```bash
curl -X POST http://localhost:3000/api/novu/subscribe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Step 6: Test Notifications

1. **Start all services:**
   ```bash
   # Terminal 1: Backend
   cd /path/to/worklab
   npm run dev

   # Terminal 2: Frontend
   cd /path/to/worklab/frontend
   npm run dev

   # Terminal 3: Centrifugo (for real-time chat)
   docker compose up centrifugo
   ```

2. **Test message notification:**
   - Log in as User A
   - Log in as User B in another browser/incognito
   - Send a message from User A to User B
   - User B should see:
     - Real-time message appears in chat (via Centrifugo)
     - Notification bell icon lights up (via Novu)
     - Click bell to see notification

3. **Check Novu Dashboard:**
   - Go to **Activity Feed** in Novu dashboard
   - You should see notification events being triggered
   - Click on an event to see delivery status

## Features Implemented

### ✅ In-App Notifications
- Bell icon in header with unread count badge
- Notification dropdown with message preview
- Click notification to navigate to conversation

### ✅ Real-Time Chat
- Instant message delivery via Centrifugo WebSocket
- Silent notifications (no popup toasts)
- Messages appear instantly in conversation

### ✅ Notification Workflows
- New Message: Notifies recipient when they receive a message
- New Job Application: Notifies job poster when someone applies
- New Contract: Notifies freelancer when contract is created

## Customization

### Change Notification Appearance

Edit `/frontend/src/components/novu-inbox.tsx`:
```typescript
appearance={{
  variables: {
    colorPrimary: 'hsl(var(--primary))',
    colorPrimaryForeground: 'hsl(var(--primary-foreground))',
    colorBackground: 'hsl(var(--background))',
    // Add more customization...
  },
}}
```

### Add New Notification Types

1. **Create workflow in Novu dashboard**
2. **Add method in novuService.js:**
   ```javascript
   async sendCustomNotification(recipientId, data) {
     await this.novu.trigger('your-workflow-id', {
       to: { subscriberId: recipientId.toString() },
       payload: data
     });
   }
   ```
3. **Call in your controller:**
   ```javascript
   const novuService = require('../services/novuService');
   await novuService.sendCustomNotification(userId, { /* data */ });
   ```

## Troubleshooting

### Notifications Not Showing

1. **Check Environment Variables:**
   ```bash
   # Backend
   echo $NOVU_API_KEY
   
   # Frontend
   echo $VITE_NOVU_APP_ID
   ```

2. **Check Subscriber Status:**
   - Go to Novu Dashboard → **Subscribers**
   - Search for your user ID
   - Verify user is subscribed

3. **Check Workflow Status:**
   - Ensure workflow is **Activated**
   - Verify workflow identifier matches code exactly

4. **Check Browser Console:**
   - Open DevTools → Console
   - Look for Novu connection errors

### API Key Issues

- **Invalid API Key**: Regenerate in Novu dashboard
- **CORS Errors**: Novu handles CORS automatically, but check frontend URL is correct

### Workflow Not Triggering

1. **Check Activity Feed** in Novu dashboard
2. **Verify payload** matches workflow variables
3. **Check backend logs** for errors

## Monitoring

### Novu Dashboard
- **Activity Feed**: See all notification events
- **Subscribers**: View all registered users
- **Workflows**: Manage notification templates

### Backend Logs
```bash
# Watch for Novu events
tail -f logs/app.log | grep "Novu"
```

## Production Deployment

1. **Use Environment Variables:**
   - Never commit API keys to Git
   - Use secrets management (AWS Secrets Manager, etc.)

2. **Enable Email/SMS Channels:**
   - Add email provider (SendGrid, Mailgun, etc.) in Novu
   - Add SMS provider (Twilio, etc.) if needed
   - Update workflows to include email/SMS steps

3. **Set Up Webhooks:**
   - Configure delivery status webhooks
   - Track notification metrics

## Resources

- [Novu Documentation](https://docs.novu.co)
- [React Inbox Component](https://docs.novu.co/inbox/react/get-started)
- [Node.js SDK](https://docs.novu.co/sdks/nodejs)
- [Workflow Guide](https://docs.novu.co/workflows/introduction)

## Support

If you encounter issues:
1. Check the [Novu Discord](https://discord.gg/novu)
2. Read [troubleshooting docs](https://docs.novu.co/help/troubleshooting)
3. Create an issue in the WorkLab repository
