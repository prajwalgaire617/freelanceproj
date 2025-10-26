# Chat System Debugging Guide

## Current Status
- ✅ Backend: Messages saved to database
- ✅ Backend: Broadcasting to Centrifugo
- ✅ Backend: Notifications sent to user channel
- ✅ Frontend: Subscribing to conversation channel
- ✅ Frontend: Duplicate message prevention
- ⚠️ Novu: Recently re-enabled (may need testing)

## Test Checklist

### 1. **Backend Verification**
Check terminal logs when sending a message:
```
Expected logs:
🔵 sendMessage called - receiverId: 14 senderId: 13
📡 Broadcasting message to channel: conversation:13:14
✅ Message broadcasted successfully to conversation:13:14
🔔 Notification sent to user:14
```

**If missing:**
- Check if backend is running (port 3000)
- Check if Centrifugo is running (port 8000)
- Verify JWT token is valid

### 2. **Frontend Real-time Subscription**
Check browser console (F12):
```
Expected logs:
🔌 Attempting to connect to Centrifugo...
✅ Connected to Centrifugo
🔔 subscribeToConversation called for users: 13, 14
📨 Real-time message received: {id: 196, senderId: 13, ...}
```

**If missing:**
- Check `VITE_CENTRIFUGO_ENABLED=true` in frontend/.env
- Check user is logged in (localStorage has token)
- Verify Centrifugo URL is correct

### 3. **Message Persistence**
Test by:
1. Send a message from User A to User B
2. Refresh the page
3. Message should still appear

**If messages disappear:**
- Check database: `SELECT * FROM messages ORDER BY id DESC LIMIT 10;`
- Verify getConversation endpoint returns messages
- Check if messages are being loaded on component mount

### 4. **Duplicate Messages**
Test by:
1. Send a message
2. Count how many times it appears in the UI

**If duplicates occur:**
- Check if `messageExists` check is working (line 113 in MessagingInterface.tsx)
- Verify message ID is unique
- Check if multiple subscriptions are created

### 5. **Notifications**

#### A. Toast Notifications (Popup)
- Send message from User A to User B
- User B should see popup notification
- Check browser console for: `🔔 Notification received:`

#### B. Novu Bell Icon
- Login to trigger Novu subscription
- Send a message
- Check if bell icon shows notification count
- Click bell icon to see notification list

**Common Novu Issues:**
- 400 error = Wrong Application ID
- 401 error = Wrong API key
- "Quiet for now" = Not subscribed or no notifications

## Known Issues & Solutions

### Issue 1: Messages not appearing in real-time
**Symptoms:** Message sent but doesn't appear until page refresh

**Solutions:**
1. Check Centrifugo connection in browser console
2. Verify conversation subscription is active
3. Check if WebSocket connection is established

### Issue 2: Duplicate messages
**Symptoms:** Same message appears 2+ times

**Solutions:**
- Already fixed by removing optimistic updates
- Duplicate check on line 113 should prevent this
- If still occurs, check message.id is being sent correctly

### Issue 3: Messages load slow
**Symptoms:** Takes long time to see sent message

**Solutions:**
- Centrifugo should broadcast instantly (<100ms)
- Check network latency in browser DevTools
- Verify Centrifugo isn't rate limiting

### Issue 4: Notifications not showing
**Symptoms:** No popup or bell icon notifications

**Toast Notifications:**
- Check RealTimeNotifications component is mounted
- Verify user channel subscription (user:14)
- Check NotificationContext provider

**Novu Notifications:**
- Logout and login again to re-subscribe
- Check backend logs for Novu subscription success
- Verify NOVU_API_KEY and NOVU_APP_IDENTIFIER are correct

## Manual Testing Steps

### Test 1: Basic Message Flow
1. Open browser as User 13 (http://localhost:5173)
2. Open incognito as User 14 (http://localhost:5173)
3. User 13 sends "Hello" to User 14
4. **Expected:** User 14 sees "Hello" instantly + notification
5. User 14 replies "Hi" to User 13
6. **Expected:** User 13 sees "Hi" instantly + notification

### Test 2: Persistence
1. User 13 sends "Test message"
2. Close and reopen browser
3. Navigate to messages
4. **Expected:** "Test message" is still there

### Test 3: Multiple Messages
1. User 13 sends 5 messages rapidly
2. **Expected:** All 5 messages appear, no duplicates
3. Scroll should auto-scroll to bottom

### Test 4: Notifications
1. User 13 is on different page (not /messages)
2. User 14 sends message to User 13
3. **Expected:** 
   - Toast notification appears (top-right corner)
   - Bell icon shows red dot/count
   - Clicking notification navigates to /messages

## Database Queries for Debugging

```sql
-- Check recent messages
SELECT id, senderId, receiverId, content, sentAt 
FROM messages 
ORDER BY id DESC 
LIMIT 20;

-- Check conversations
SELECT * FROM conversations 
ORDER BY lastMessageAt DESC;

-- Check message count between two users
SELECT COUNT(*) 
FROM messages 
WHERE (senderId = 13 AND receiverId = 14) 
   OR (senderId = 14 AND receiverId = 13);

-- Check unread messages
SELECT * FROM messages 
WHERE receiverId = 13 
AND isRead = false;
```

## Environment Variables Checklist

### Backend (.env)
```
CENTRIFUGO_URL=ws://localhost:8000/connection/websocket
CENTRIFUGO_API_URL=http://localhost:8000/api
CENTRIFUGO_API_KEY=worklab_centrifugo_api_key_2024
CENTRIFUGO_SECRET=worklab_centrifugo_secret_key_2024
NOVU_API_KEY=c1f057f6bff3a75513b7e70240178dd3
NOVU_APP_IDENTIFIER=1JLW133rPXUS
```

### Frontend (.env)
```
VITE_CENTRIFUGO_URL=ws://localhost:8000/connection/websocket
VITE_CENTRIFUGO_ENABLED=true
VITE_NOVU_APP_ID=1JLW133rPXUS
VITE_NOVU_BACKEND_URL=https://api.novu.co
VITE_NOVU_SOCKET_URL=https://ws.novu.co
```

## Quick Fixes

### Reset Everything
```bash
# Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Restart Centrifugo
docker-compose up -d centrifugo

# Restart backend
cd /Users/prajwalgaire/worklab
npm run dev

# Restart frontend
cd /Users/prajwalgaire/worklab/frontend
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"
4. Clear localStorage: `localStorage.clear()`

### Verify Services Running
```bash
# Check backend
curl http://localhost:3000/health

# Check Centrifugo
curl http://localhost:8000/health

# Check database
mysql -u root worklab -e "SELECT COUNT(*) FROM messages;"
```

## Contact Info
If issues persist, provide:
1. Backend terminal logs (last 50 lines)
2. Browser console logs (F12)
3. Network tab showing failed requests
4. Specific error messages
