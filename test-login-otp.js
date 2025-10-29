const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:3000';

async function run() {
  const testEmail = process.env.TEST_EMAIL || 'otplogin@example.com';
  console.log('🧪 Testing passwordless login flow for', testEmail);
  try {
    // Step 1: Request login OTP
    const reqRes = await axios.post(`${BASE_URL}/api/auth/login/otp/request`, { email: testEmail });
    console.log('Request OTP:', reqRes.data);

    console.log('\n⚠️ Retrieve the OTP from your email inbox to complete test manually.');
    console.log('Then call the verify endpoint with { email, otp }');
    console.log('Or temporarily log the OTP in controller for automated tests.');
  } catch (e) {
    console.error('Failed:', e.response?.data || e.message);
  }
}

run();
