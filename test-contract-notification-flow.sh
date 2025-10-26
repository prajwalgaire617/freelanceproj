#!/bin/bash
# Test Contract Notification Flow

echo "🧪 Contract Notification Test Guide"
echo "===================================="
echo ""

echo "📋 TEST SCENARIO 1: Receiver is ONLINE (on /messages page)"
echo "------------------------------------------------------------"
echo "1. Open browser window 1: Login as FREELANCER (receiver)"
echo "2. Navigate to: http://localhost:5173/messages"
echo "3. Open browser window 2: Login as CLIENT (sender)"
echo "4. Send a contract to the freelancer"
echo ""
echo "✅ EXPECTED RESULTS:"
echo "   - Freelancer sees toast notification instantly"
echo "   - Contract appears in chat conversation instantly"
echo "   - No page refresh needed"
echo ""

echo "📋 TEST SCENARIO 2: Receiver is ONLINE (on different page)"
echo "------------------------------------------------------------"
echo "1. Open browser window 1: Login as FREELANCER (receiver)"
echo "2. Navigate to: http://localhost:5173/jobs (NOT on messages page)"
echo "3. Open DevTools console (to see logs)"
echo "4. Open browser window 2: Login as CLIENT (sender)"
echo "5. Send a contract to the freelancer"
echo ""
echo "✅ EXPECTED RESULTS:"
echo "   - Freelancer sees toast notification instantly"
echo "   - Console shows: '🔔 Real-time notification received'"
echo "   - Console shows: '📋 Processing contract notification'"
echo "   - When freelancer navigates to /messages, contract is there"
echo ""

echo "📋 TEST SCENARIO 3: Receiver is OFFLINE"
echo "------------------------------------------------------------"
echo "1. Close all browser windows for FREELANCER (receiver is offline)"
echo "2. Login as CLIENT (sender)"
echo "3. Send a contract to the freelancer"
echo "4. Wait 10 seconds"
echo "5. Open new browser: Login as FREELANCER"
echo "6. Navigate to: http://localhost:5173/messages"
echo ""
echo "✅ EXPECTED RESULTS:"
echo "   - NO toast notification (receiver was offline when sent)"
echo "   - Contract IS visible in conversation list ('📄 Contract sent')"
echo "   - Click conversation - contract card appears"
echo "   - Can click 'View Contract Details'"
echo ""

echo "🔍 VERIFY IN DATABASE:"
echo "------------------------------------------------------------"
mysql -u root worklab -e "
SELECT 
  'Latest Contract' as Type,
  id, 
  clientId, 
  freelancerId, 
  workTitle, 
  totalAmount,
  createdAt 
FROM Contracts 
ORDER BY createdAt DESC 
LIMIT 1;

SELECT 
  'Contract Message' as Type,
  id,
  senderId,
  receiverId,
  messageType,
  contractId,
  sentAt
FROM Messages 
WHERE messageType = 'contract' 
ORDER BY sentAt DESC 
LIMIT 1;
" 2>/dev/null

echo ""
echo "🎯 CONCLUSION:"
echo "------------------------------------------------------------"
echo "Real-time notifications work when receiver is ONLINE."
echo "Contracts are ALWAYS saved to database."
echo "Offline users see contracts when they open /messages."
echo ""
echo "This is NORMAL behavior for WebSocket-based systems."
echo "For offline notification, consider:"
echo "  1. Email notifications"
echo "  2. Database-backed notification center"
echo "  3. Push notifications (browser/mobile)"
