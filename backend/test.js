#!/usr/bin/env node
/**
 * ClawFactory Backend Test Script
 * Tests all API endpoints
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_URL_WS = process.env.WS_URL || 'ws://localhost:3001';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  return await response.json();
}

async function testAPI() {
  console.log('🧪 ClawFactory Backend Tests\n' + '='.repeat(40));

  // Test 1: Health check
  console.log('\n1. Health Check...');
  const health = await request('/health');
  console.log(health.status === 'ok' ? '✅ Health OK' : '❌ Health Failed');

  // Test 2: List copies
  console.log('\n2. List Copies...');
  const copies = await request('/api/copies');
  console.log(`✅ Found ${copies.length} copies`);

  // Test 3: Get categories
  console.log('\n3. Get Categories...');
  const categories = await request('/api/categories');
  console.log(`✅ Found ${categories.length} categories`);

  // Test 4: Search
  console.log('\n4. Search...');
  const search = await request('/api/search?q=trading');
  console.log(`✅ Search returned ${search.length} results`);

  // Test 5: Featured
  console.log('\n5. Featured...');
  const featured = await request('/api/featured');
  console.log(`✅ Featured: ${featured.length} copies`);

  // Test 6: Register user
  console.log('\n6. Register User...');
  const register = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: 'testuser', email: 'test@example.com' })
  });
  console.log(register.success ? '✅ User registered' : '❌ Registration failed');

  // Test 7: Login
  console.log('\n7. Login...');
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'testuser' })
  });
  console.log(login.success ? '✅ Login success' : '❌ Login failed');

  // Test 8: Marketplace
  console.log('\n8. Marketplace...');
  const marketplace = await request('/api/marketplace');
  console.log(`✅ Marketplace: ${marketplace.length} copies`);

  // Test 9: Export
  console.log('\n9. Export Data...');
  const exportData = await request('/api/export');
  console.log(`✅ Export: ${exportData.copies?.length || 0} copies`);

  console.log('\n' + '='.repeat(40));
  console.log('🎉 All tests completed!');
}

testAPI().catch(console.error);
