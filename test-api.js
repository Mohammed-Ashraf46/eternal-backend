const axios = require('axios');

// Test the API endpoint
async function testAPI() {
  try {
    console.log('🧪 Testing Eternal Chat Backend API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await axios.get('http://localhost:3000/');
    console.log('✅ Root endpoint:', rootResponse.data);
    console.log('');

    // Test message endpoint (this will fail without valid API key)
    console.log('3. Testing message endpoint...');
    const messageResponse = await axios.post('http://localhost:3000/api/message', {
      message: 'مرحبا، كيف حالك؟',
      character: 'صلاح الدين الأيوبي'
    });
    console.log('✅ Message response:', messageResponse.data);

  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('❌ Network Error: Unable to connect to server');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Run the test
testAPI();
