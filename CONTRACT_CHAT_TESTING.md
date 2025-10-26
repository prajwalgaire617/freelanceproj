# Contract Chat Integration - Testing Guide

## ✅ What Was Implemented

### Backend Changes
1. **Contract Message Creation** (`src/controllers/contractController.js`)
   - When a contract is created, it now automatically creates a message in the chat
   - Message type: `'contract'`
   - Content: JSON string with contract details (workTitle, totalAmount, dates)
   - Foreign key: `contractId` links to the Contract table

2. **Real-time Broadcasting**
   - Contract messages are broadcast to the conversation channel
   - Both client and freelancer see the contract appear in their chat
   - Conversation table is updated with the last message

3. **User Notifications**
   - Notification sent to freelancer's user channel
   - Toast notification should appear (if implemented)
   - Novu notification should trigger (if configured)

### Frontend Changes
1. **ContractMessage Component** (`frontend/src/components/messaging/ContractMessage.tsx`)
   - Special UI component for displaying contract messages
   - Shows: workTitle, totalAmount, start/end dates
   - "View Contract Details" button navigates to `/contracts/{contractId}`
   - Styled with blue theme for sender, slate theme for receiver

2. **MessagingInterface Updates** (`frontend/src/components/messaging/MessagingInterface.tsx`)
   - Updated `Message` interface to include `messageType`, `contractId`, `content`
   - Contract messages render with `ContractMessage` component
   - Regular messages render with existing UI
   - Real-time messages include contract data

## 🧪 How to Test

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd /Users/prajwalgaire/worklab
npm start

# Terminal 2 - Frontend
cd /Users/prajwalgaire/worklab/frontend
npm run dev

# Terminal 3 - Centrifugo (if not running)
cd /Users/prajwalgaire/worklab
./start-centrifugo.sh
```

### Step 2: Create a Contract
1. Login as a **client** user
2. Navigate to a freelancer's profile or job application
3. Click "Send Contract" or "Create Contract"
4. Fill in contract details:
   - Work Title
   - Total Amount
   - Contract Start Date
   - Contract End Date
   - Terms and conditions
5. Click "Submit" or "Send Contract"

### Step 3: Verify Contract in Chat
1. **As Client (Sender)**:
   - Navigate to Messages (`/messages`)
   - Open conversation with the freelancer
   - You should see a blue contract card with:
     - 📋 Work Title
     - 💰 Amount
     - 📅 Start Date
     - 📅 End Date
     - "View Contract Details" button

2. **As Freelancer (Receiver)**:
   - Login as the freelancer
   - Navigate to Messages (`/messages`)
   - Open conversation with the client
   - You should see a slate/gray contract card
   - Toast notification should appear (if implemented)
   - Novu bell icon should show notification (if configured)

### Step 4: Test Contract Navigation
1. Click "View Contract Details" button
2. Should navigate to `/contracts/{contractId}`
3. Should display full contract details page

### Step 5: Verify Real-time Updates
1. Keep both client and freelancer chats open
2. Send a contract from client
3. Freelancer's chat should update **instantly** without refresh
4. Contract card should appear in both chats

## 🔍 Backend Verification

### Check Database
```sql
-- View contract messages
SELECT id, senderId, receiverId, messageType, contractId, content, sentAt 
FROM Messages 
WHERE messageType = 'contract' 
ORDER BY sentAt DESC 
LIMIT 10;

-- View conversations updated with contract messages
SELECT * FROM Conversations 
WHERE lastMessageId IN (
  SELECT id FROM Messages WHERE messageType = 'contract'
);
```

### Check Backend Logs
Look for these log messages:
```
📨 Contract message sent to conversation:13:14
✅ Message broadcasted successfully to conversation:13:14
🔔 Notification sent to user:14
```

### Check Centrifugo Logs
```bash
docker logs centrifugo-server
```
Look for:
```
[INFO] publish to conversation:13:14
[INFO] publish to user:14
```

## 📊 Expected Message Structure

### Backend Message Record
```javascript
{
  id: 123,
  senderId: 13,
  receiverId: 14,
  content: '{"type":"contract","contractId":45,"workTitle":"Website Development","totalAmount":5000,"contractStartDate":"2024-01-15","contractEndDate":"2024-02-15","message":"Contract sent: Website Development"}',
  messageType: 'contract',
  contractId: 45,
  sentAt: '2024-01-10T10:30:00.000Z',
  isRead: false
}
```

### Frontend Message Object
```typescript
{
  id: 123,
  sender: "me", // or "them"
  text: '{"type":"contract",...}',
  time: "10:30 AM",
  messageType: 'contract',
  contractId: 45,
  content: '{"type":"contract","contractId":45,...}'
}
```

## ❓ Troubleshooting

### Contract Message Not Appearing in Chat

**Check 1: Database**
```sql
SELECT * FROM Messages WHERE messageType = 'contract' ORDER BY sentAt DESC LIMIT 1;
```
If no rows: Contract creation failed

**Check 2: Backend Logs**
- Look for "📨 Contract message sent to conversation"
- If missing: Error in contractController.js

**Check 3: Frontend Console**
- Open browser DevTools → Console
- Look for: "📨 Real-time message received:"
- Check if messageType === 'contract'

**Check 4: Centrifugo Connection**
- Console should show: "✅ Connected to Centrifugo"
- Check: "🔔 Subscribed to conversation:X:Y"

### Contract Card Not Rendering

**Check 1: Message Type**
- Console log the message object
- Verify `messageType === 'contract'`
- Verify `contractId` is present

**Check 2: JSON Parsing**
- Open DevTools → Console
- Look for JSON parse errors
- Content should be valid JSON string

**Check 3: Component Import**
- Check MessagingInterface.tsx imports ContractMessage
- Check ContractMessage.tsx has no errors

### "View Contract Details" Button Not Working

**Check 1: Contract ID**
- Verify contractId is passed to ContractMessage component
- Check browser console for errors on click

**Check 2: Route**
- Verify `/contracts/{contractId}` route exists
- Check if user has permission to view contracts

## 🎯 Success Criteria

✅ Contract sent successfully from client
✅ Contract appears as special card in client's chat (blue theme)
✅ Contract appears as special card in freelancer's chat (gray theme)
✅ Real-time update works (no page refresh needed)
✅ Toast notification appears for freelancer
✅ Contract displays: title, amount, dates
✅ "View Contract Details" button works
✅ Both users can click to view full contract
✅ Regular text messages still work normally
✅ File/image messages still work normally

## 🔄 Next Steps (Optional Enhancements)

1. **Contract Actions in Chat**
   - Add "Accept" and "Decline" buttons for freelancer
   - Update contract status directly from chat

2. **Contract Status Updates**
   - Send message when contract is accepted
   - Send message when contract status changes

3. **Contract Preview**
   - Show contract PDF preview in chat
   - Add download button for contract document

4. **Contract Reminders**
   - Send reminder message before contract start date
   - Send reminder message before contract end date

5. **Contract Amendments**
   - Send message when contract is amended
   - Show diff between old and new contract terms
