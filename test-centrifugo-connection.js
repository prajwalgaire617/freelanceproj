const { Centrifuge } = require('centrifuge');
const axios = require('axios');
const WebSocket = require('ws');

async function testConnection() {
  try {
    console.log('🔧 Testing Centrifugo connection...\n');
    
    // 1. Get token from backend
    console.log('1️⃣ Getting token from backend...');
    const tokenResponse = await axios.post('http://127.0.0.1:3000/api/centrifugo/token', {
      userId: '13',
      userInfo: { userId: '13' }
    });
    
    const { token } = tokenResponse.data.data;
    console.log('✅ Token received:', token.substring(0, 50) + '...\n');
    
    // 2. Connect to Centrifugo
    console.log('2️⃣ Connecting to Centrifugo...');
    const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
      token: token,
      websocket: WebSocket
    });
    
    centrifuge.on('connecting', (ctx) => {
      console.log('🔄 Connecting...', ctx);
    });
    
    centrifuge.on('connected', (ctx) => {
      console.log('✅ Connected!', ctx);
      
      // 3. Subscribe to a channel
      console.log('\n3️⃣ Subscribing to conversation:13:14...');
      const sub = centrifuge.newSubscription('conversation:13:14');
      
      sub.on('subscribing', (ctx) => {
        console.log('🔄 Subscribing...', ctx);
      });
      
      sub.on('subscribed', (ctx) => {
        console.log('✅ Subscribed successfully!', ctx);
        console.log('\n✅ ALL TESTS PASSED! Real-time messaging should work.\n');
        
        // Keep alive for a few seconds to see any messages
        setTimeout(() => {
          console.log('🔌 Disconnecting...');
          centrifuge.disconnect();
          process.exit(0);
        }, 5000);
      });
      
      sub.on('error', (ctx) => {
        console.error('❌ Subscription error:', ctx);
        process.exit(1);
      });
      
      sub.on('publication', (ctx) => {
        console.log('📨 Message received:', ctx.data);
      });
      
      sub.subscribe();
    });
    
    centrifuge.on('disconnected', (ctx) => {
      console.log('❌ Disconnected:', ctx);
    });
    
    centrifuge.on('error', (ctx) => {
      console.error('❌ Connection error:', ctx);
      process.exit(1);
    });
    
    centrifuge.connect();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testConnection();
