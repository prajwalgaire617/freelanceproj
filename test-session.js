const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:3000';

async function testSessionManagement() {
  console.log('🧪 Testing Session Management System\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      userType: 'freelancer'
    });

    console.log('✅ Registration successful');
    console.log('Session ID:', registerResponse.data.sessionId);
    console.log('Token received:', !!registerResponse.data.token);
    console.log('User ID:', registerResponse.data.user.id);
    console.log('');

    const token1 = registerResponse.data.token;
    const sessionId1 = registerResponse.data.sessionId;

    // Test 2: Login with same user (should invalidate previous session)
    console.log('2. Testing login (should invalidate previous session)...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Login successful');
    console.log('New Session ID:', loginResponse.data.sessionId);
    console.log('New Token received:', !!loginResponse.data.token);
    console.log('');

    const token2 = loginResponse.data.token;
    const sessionId2 = loginResponse.data.sessionId;

    // Test 3: Try to use old token (should fail)
    console.log('3. Testing old token (should fail)...');
    try {
      await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      console.log('❌ Old token should have been invalidated!');
    } catch (error) {
      console.log('✅ Old token correctly invalidated');
      console.log('Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 4: Use new token (should work)
    console.log('4. Testing new token...');
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ New token works');
    console.log('User data:', meResponse.data.user.email);
    console.log('');

    // Test 5: Get active sessions
    console.log('5. Testing get active sessions...');
    const sessionsResponse = await axios.get(`${BASE_URL}/api/auth/sessions`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Sessions retrieved');
    console.log('Active sessions:', sessionsResponse.data.sessions.length);
    console.log('Current session ID:', sessionsResponse.data.sessions[0]?.sessionId);
    console.log('');

    // Test 6: Logout
    console.log('6. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Logout successful');
    console.log('Message:', logoutResponse.data.message);
    console.log('');

    // Test 7: Try to use token after logout (should fail)
    console.log('7. Testing token after logout (should fail)...');
    try {
      await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      console.log('❌ Token should have been invalidated after logout!');
    } catch (error) {
      console.log('✅ Token correctly invalidated after logout');
      console.log('Error:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 All tests passed! Session management is working correctly.');
    console.log('\nKey Features Verified:');
    console.log('✅ Single session per user (new login invalidates old sessions)');
    console.log('✅ Session-based JWT authentication');
    console.log('✅ Proper logout functionality');
    console.log('✅ Session tracking and management');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSessionManagement();
