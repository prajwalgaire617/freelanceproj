#!/bin/bash
# Quick test script to verify contract delivery

echo "🔍 Checking latest contract..."
mysql -u root worklab -e "SELECT id, clientId, freelancerId, workTitle, contractStatus, createdAt FROM Contracts ORDER BY createdAt DESC LIMIT 1;"

echo ""
echo "🔍 Checking if contract message was created..."
mysql -u root worklab -e "SELECT id, senderId, receiverId, messageType, contractId, LEFT(content, 100) as preview, sentAt FROM Messages WHERE messageType = 'contract' ORDER BY sentAt DESC LIMIT 1;"

echo ""
echo "🔍 Checking conversation update..."
mysql -u root worklab -e "SELECT c.id, c.participant1Id, c.participant2Id, m.messageType, m.contractId, c.lastMessageAt FROM Conversations c LEFT JOIN Messages m ON c.lastMessageId = m.id WHERE m.messageType = 'contract' ORDER BY c.lastMessageAt DESC LIMIT 1;"

echo ""
echo "✅ If you see contract message above, the feature is working!"
echo "❌ If no contract message found, send a NEW contract to test."
