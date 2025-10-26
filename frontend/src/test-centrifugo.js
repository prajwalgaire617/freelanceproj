// Simple test script to verify Centrifugo integration
// Run this in browser console after logging in as user 13
const testRealTimeMessaging = async () => {
  console.log('🧪 Starting real-time messaging test...');

  // 1. Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user.id) {
    console.error('❌ No authentication found. Please login first.');
    return;
  }

  console.log('✅ User authenticated:', user.id);

  // 2. Test token endpoint
  try {
    const response = await fetch('http://localhost:3000/api/centrifugo/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user.id,
        userInfo: { userId: user.id }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Token generated:', data.data.token ? 'Yes' : 'No');
    } else {
      console.error('❌ Token generation failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('❌ Token request failed:', error);
  }

  // 3. Test if Centrifugo service is working
  if (window.centrifugoService) {
    console.log('✅ Centrifugo service available');
    console.log('🔌 Connected:', window.centrifugoService.isConnected());

    // Try to subscribe to a test channel
    const testSubscription = window.centrifugoService.subscribeToConversation(
      user.id.toString(),
      '14', // Test with user 14
      (messageData) => {
        console.log('📨 TEST MESSAGE RECEIVED:', messageData);
      }
    );

    if (testSubscription) {
      console.log('✅ Test subscription created');
    } else {
      console.log('❌ Test subscription failed');
    }
  } else {
    console.log('❌ Centrifugo service not available');
  }

  console.log('🧪 Test complete. Check console for results.');
};

// Make centrifugoService available globally for testing
window.centrifugoService = centrifugoService;
