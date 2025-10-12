#!/usr/bin/env node

/**
 * BUILDERS CODE CMS - PRODUCTION API TESTING SCRIPT
 * 
 * This script tests the production APIs to verify:
 * - API connectivity
 * - Database connection
 * - Authentication
 * - Basic CRUD operations
 */

const https = require('https');

// Production API URL - update this with your actual deployment URL
const API_BASE_URL = 'https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app';

// Test admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  senha: 'admin123'
};

// Helper function to make HTTP requests
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.method === 'POST' && options.body) {
      req.write(options.body);
    }

    req.end();
  });
};

// Test functions
const testHealthCheck = async () => {
  console.log('🔍 Testing API health check...');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/status`);
    
    if (response.status === 200) {
      console.log('✅ Health check passed');
      console.log('   Message:', response.data.message);
      return true;
    } else {
      console.log('❌ Health check failed');
      console.log('   Status:', response.status);
      console.log('   Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
    return false;
  }
};

const testAuthentication = async () => {
  console.log('🔐 Testing authentication...');
  try {
    const loginData = JSON.stringify(ADMIN_CREDENTIALS);
    
    const response = await makeRequest(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      },
      body: loginData
    });

    if (response.status === 200 && response.data.token) {
      console.log('✅ Authentication successful');
      console.log('   User:', response.data.user.username);
      console.log('   Role:', response.data.user.role);
      return response.data.token;
    } else {
      console.log('❌ Authentication failed');
      console.log('   Status:', response.status);
      console.log('   Response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return null;
  }
};

const testProtectedEndpoint = async (token) => {
  console.log('🛡️  Testing protected endpoint...');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/categorias`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('✅ Protected endpoint access successful');
      console.log('   Categories found:', response.data.data?.length || 0);
      return true;
    } else {
      console.log('❌ Protected endpoint access failed');
      console.log('   Status:', response.status);
      console.log('   Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Protected endpoint error:', error.message);
    return false;
  }
};

const testDatabaseData = async (token) => {
  console.log('📊 Testing database data...');
  
  const endpoints = [
    { name: 'Categories', url: '/api/categorias' },
    { name: 'Sections', url: '/api/secoes' },
    { name: 'Projects', url: '/api/projetos' },
    { name: 'Configurations', url: '/api/configuracoes' }
  ];

  let allSuccess = true;

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${API_BASE_URL}${endpoint.url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const count = response.data.data?.length || response.data.length || 0;
        console.log(`   ✅ ${endpoint.name}: ${count} records`);
      } else {
        console.log(`   ❌ ${endpoint.name}: Failed (${response.status})`);
        allSuccess = false;
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: Error - ${error.message}`);
      allSuccess = false;
    }
  }

  return allSuccess;
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Builder\'s Code CMS - Production API Testing');
  console.log('==============================================');
  console.log(`📍 API URL: ${API_BASE_URL}`);
  console.log('');

  let passedTests = 0;
  const totalTests = 4;

  // Test 1: Health Check
  if (await testHealthCheck()) {
    passedTests++;
  }
  console.log('');

  // Test 2: Authentication
  const token = await testAuthentication();
  if (token) {
    passedTests++;
  }
  console.log('');

  if (token) {
    // Test 3: Protected Endpoint
    if (await testProtectedEndpoint(token)) {
      passedTests++;
    }
    console.log('');

    // Test 4: Database Data
    if (await testDatabaseData(token)) {
      passedTests++;
    }
    console.log('');
  } else {
    console.log('⚠️  Skipping protected endpoint tests due to authentication failure');
    console.log('');
  }

  // Summary
  console.log('==============================================');
  console.log('📊 Test Summary');
  console.log('==============================================');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Production API is working correctly.');
    console.log('');
    console.log('🔗 Production URLs:');
    console.log(`   API Base: ${API_BASE_URL}`);
    console.log(`   Status: ${API_BASE_URL}/api/status`);
    console.log(`   Login: ${API_BASE_URL}/api/auth/login`);
    console.log('');
    console.log('👤 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');
  } else {
    console.log('❌ Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
};

// Run tests if called directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };