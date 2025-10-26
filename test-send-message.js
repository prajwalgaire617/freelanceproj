const axios = require('axios');

async function testSendMessage() {
  try {
    console.log('📤 Testing message send and broadcast...\n');
    
    // You'll need to replace this with a real auth token
    // Login first to get a token, or use an existing one from localStorage
    const token = 'YOUR_AUTH_TOKEN_HERE'; // Replace with actual token
    
    const response = await axios.post(
      'http://127.0.0.1:3000/api/messages',
      {
        receiverId: 14,  // Sending to user 14
        content: 'Test real-time message from script'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Message sent:', response.data);
    console.log('\n📡 Check Centrifugo logs for broadcast confirmation');
    console.log('📱 Check browser console for real-time message reception');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSendMessage();
