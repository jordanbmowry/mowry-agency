// Email Test Script - Test email functionality independently
import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('🧪 Testing email configuration...');

  // Read environment variables
  const smtpUser = process.env.SMTP_USER || 'mowryagency@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'your-app-password-here';

  console.log('📧 Email settings:');
  console.log('- SMTP User:', smtpUser);
  console.log('- SMTP Pass:', smtpPass ? '✅ Set' : '❌ Not set');

  if (!smtpPass || smtpPass === 'your-app-password-here') {
    console.log('❌ Email credentials not configured properly');
    console.log('📋 To fix:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification');
    console.log('3. Generate App Password for Mail');
    console.log('4. Update .env file with SMTP_PASS=your-app-password');
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verify connection
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Mowry Agency" <${smtpUser}>`,
      to: 'mowryagency@gmail.com',
      subject: 'Test Email - Mowry Agency Contact Form',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testEmail();
