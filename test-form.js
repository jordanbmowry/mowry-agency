// Test the contact form API endpoint
const testFormSubmission = async () => {
  console.log('Testing contact form API...');

  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '555-123-4567',
    coverageType: 'Term Life Insurance',
    message:
      'This is a test form submission to verify the API works correctly.',
  };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Form submission successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Form submission failed');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
};

testFormSubmission();
