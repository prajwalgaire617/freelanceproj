#!/usr/bin/env node
/**
 * Test Google OAuth Configuration
 * Run: node test-google-oauth.js
 */

require('dotenv').config();
const https = require('https');
const { URL } = require('url');

console.log('🔍 Testing Google OAuth Configuration...\n');

// Check environment variables
console.log('1. Checking environment variables:');
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
console.log('   GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'Using default');
console.log('');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing required environment variables!');
  process.exit(1);
}

// Test network connectivity to Google
console.log('2. Testing connectivity to Google OAuth servers:');

const testUrls = [
  'https://accounts.google.com/.well-known/openid-configuration',
  'https://www.googleapis.com',
  'https://oauth2.googleapis.com/token'
];

let testsCompleted = 0;
let testsPassed = 0;

testUrls.forEach(url => {
  const urlObj = new URL(url);
  const options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.pathname,
    method: 'GET',
    timeout: 5000,
    headers: {
      'User-Agent': 'WorkLab-OAuth-Test'
    }
  };

  const req = https.request(options, (res) => {
    testsCompleted++;
    if (res.statusCode < 500) {
      testsPassed++;
      console.log(`   ✅ ${urlObj.hostname} - Status: ${res.statusCode}`);
    } else {
      console.log(`   ❌ ${urlObj.hostname} - Status: ${res.statusCode}`);
    }
    
    if (testsCompleted === testUrls.length) {
      printSummary();
    }
  });

  req.on('error', (error) => {
    testsCompleted++;
    console.log(`   ❌ ${urlObj.hostname} - Error: ${error.code || error.message}`);
    
    if (testsCompleted === testUrls.length) {
      printSummary();
    }
  });

  req.on('timeout', () => {
    testsCompleted++;
    req.destroy();
    console.log(`   ❌ ${urlObj.hostname} - Timeout`);
    
    if (testsCompleted === testUrls.length) {
      printSummary();
    }
  });

  req.end();
});

function printSummary() {
  console.log('');
  console.log('3. Summary:');
  console.log(`   Tests passed: ${testsPassed}/${testUrls.length}`);
  console.log('');
  
  if (testsPassed === testUrls.length) {
    console.log('✅ Network connectivity is good!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Verify your Google Cloud Console settings:');
    console.log('      - Go to: https://console.cloud.google.com/apis/credentials');
    console.log('      - Check "Authorized redirect URIs" includes:');
    console.log(`        ${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'}`);
    console.log('   2. Restart your backend: npm run dev');
    console.log('   3. Try Google OAuth login again');
  } else {
    console.log('⚠️  Network connectivity issues detected!');
    console.log('');
    console.log('Possible causes:');
    console.log('   - Firewall blocking HTTPS connections');
    console.log('   - Proxy configuration needed');
    console.log('   - Network instability');
    console.log('');
    console.log('Try:');
    console.log('   - Check your firewall settings');
    console.log('   - Try from a different network');
    console.log('   - Configure proxy if needed');
  }
  
  process.exit(testsPassed === testUrls.length ? 0 : 1);
}
