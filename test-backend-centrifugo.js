// Backend test script to verify Centrifugo integration
const axios = require('axios');
const CentrifugoService = require('./src/services/centrifugoService');

async function testCentrifugo() {
  console.log('🧪 Testing Centrifugo backend integration...');

  try {
    // 1. Test token generation
    const userId = '13';
    const token = CentrifugoService.generateToken(userId, { userId });
    console.log('✅ Token generated:', token ? 'Yes' : 'No');

    // 2. Test channel naming
    const channel13_14 = CentrifugoService.getConversationChannel('13', '14');
    const channel14_13 = CentrifugoService.getConversationChannel('14', '13');
    console.log('✅ Channel 13-14:', channel13_14);
    console.log('✅ Channel 14-13:', channel14_13);
    console.log('✅ Channels match:', channel13_14 === channel14_13);

    // 3. Test publishing
    const testMessage = {
      id: Date.now(),
      senderId: 13,
      receiverId: 14,
      content: 'Test message from backend',
      messageType: 'text',
      sentAt: new Date().toISOString()
    };

    await CentrifugoService.publishMessage(channel13_14, testMessage);
    console.log('✅ Test message published to:', channel13_14);

    console.log('🧪 Backend test complete!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
}

// Run the test
testCentrifugo();
