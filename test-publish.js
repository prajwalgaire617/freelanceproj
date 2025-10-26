const CentrifugoService = require('./src/services/centrifugoService');

async function testPublish() {
  try {
    console.log('🧪 Testing Centrifugo publish...\n');
    
    const channel = 'conversation:13:14';
    const testMessage = {
      id: 999,
      senderId: 13,
      receiverId: 14,
      content: 'Test message from publish script',
      messageType: 'text',
      sentAt: new Date(),
      sender: {
        id: 13,
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    console.log(`📡 Publishing to channel: ${channel}`);
    console.log(`📦 Message:`, testMessage);
    
    await CentrifugoService.publishMessage(channel, testMessage);
    
    console.log('\n✅ Publish completed!');
    console.log('📱 Check browser console - you should see the message appear in real-time');
    console.log('🔍 Check Centrifugo logs for publish confirmation');
    
  } catch (error) {
    console.error('\n❌ Publish failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPublish();
