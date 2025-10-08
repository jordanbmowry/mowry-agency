// Test contact form submission with detailed error handling
const testContactFormSubmission = async () => {
  console.log('🧪 Testing Contact Form Submission...');

  const testFormData = {
    firstName: 'Jordan',
    lastName: 'Test',
    email: 'jordan.test@example.com',
    phone: '(555) 123-4567',
    coverageType: 'Term Life Insurance',
    message:
      'I would like to get a quote for a $500,000 term life insurance policy. I am 35 years old and in good health.',
  };

  console.log('📋 Submitting form data:', testFormData);

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(testFormData),
    });

    console.log('📡 HTTP Status:', response.status);
    console.log('📡 HTTP Status Text:', response.statusText);
    console.log(
      '📡 Response Headers:',
      Object.fromEntries(response.headers.entries())
    );

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (response.ok) {
      console.log('✅ Form submission SUCCESSFUL!');
      console.log('📋 Response:', responseData);

      // Test if we got a success response
      if (typeof responseData === 'object' && responseData.success) {
        console.log('✅ API returned success confirmation');
      }
    } else {
      console.log('❌ Form submission FAILED');
      console.log('📋 Error response:', responseData);
    }
  } catch (networkError) {
    console.error('❌ Network/Connection error:', networkError.message);
    console.error('❌ Full error:', networkError);
  }
};

// Also test if server is responsive
const testServerHealth = async () => {
  console.log('🏥 Testing server health...');
  try {
    const response = await fetch('http://localhost:3000/');
    console.log('✅ Server is responsive, status:', response.status);
  } catch (error) {
    console.error('❌ Server not responding:', error.message);
  }
};

// Run tests
async function runTests() {
  await testServerHealth();
  console.log('---');
  await testContactFormSubmission();
}

runTests();
