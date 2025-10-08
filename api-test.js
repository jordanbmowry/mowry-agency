// Simple Supabase test using fetch to test the API endpoint
async function testSupabaseViaAPI() {
  console.log('🧪 Testing Supabase via API endpoint...');

  const testData = {
    firstName: 'API',
    lastName: 'Test',
    email: 'apitest@example.com',
    phone: '555-999-8888',
    coverageType: 'Whole Life Insurance',
    message:
      'This is a test to verify Supabase is working via the API endpoint.',
  };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📡 Response status:', response.status);
    console.log(
      '📡 Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      try {
        const result = await response.json();
        console.log('✅ API call successful!');
        console.log('📋 Response data:', result);
      } catch (parseError) {
        const text = await response.text();
        console.log('✅ API call successful (non-JSON response)');
        console.log('📋 Response text:', text);
      }
    } else {
      console.log('❌ API call failed');
      const errorText = await response.text();
      console.log('📋 Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Network/Connection error:', error.message);
  }
}

testSupabaseViaAPI();
