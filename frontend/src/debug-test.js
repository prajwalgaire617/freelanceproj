// Frontend debug test - save this as frontend/src/debug-test.js and import it temporarily
import centrifugoService from './services/centrifugo';

export function debugTest() {
  console.log('🔧 DEBUG: Testing frontend subscription...');

  // Check if connected
  console.log('🔌 Connected:', centrifugoService.isConnected());

  // Try to subscribe directly
  const subscription = centrifugoService.subscribeToConversation('13', '14', (data) => {
    console.log('📨 DIRECT SUBSCRIPTION RECEIVED:', data);
  });

  if (subscription) {
    console.log('✅ Direct subscription created');
  } else {
    console.log('❌ Failed to create subscription');
  }

  // Check all current subscriptions
  console.log('📋 Current subscriptions:', Array.from(centrifugoService.subscriptions.keys()));
}

// Call this in browser console: import('./debug-test.js').then(m => m.debugTest())
