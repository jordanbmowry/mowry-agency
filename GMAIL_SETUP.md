# Gmail Setup Instructions for Mowry Agency

## Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Under "How you sign in to Google", select "2-Step Verification"
3. Follow the prompts to enable if not already enabled

## Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" from the dropdown
3. Click "Generate"
4. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

## Step 3: Update Environment Variables

Update your `.env` file with:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mowryagency@gmail.com
SMTP_PASS=your-16-character-app-password-here

# Agency email where leads will be sent
AGENCY_EMAIL=mowryagency@gmail.com
```

## Step 4: Test Email Configuration

After updating the .env file, restart the development server:

```bash
npm run dev
```

Then test the contact form:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "coverageType": "Term Life",
    "message": "Testing email functionality"
  }'
```

## Troubleshooting

- **"Invalid login" error**: Check that 2-Step Verification is enabled
- **"Username and Password not accepted"**: Generate a new App Password
- **"Less secure app access"**: This is not needed with App Passwords

## References

- Gmail SMTP Setup: https://nodemailer.com/usage/using-gmail/
- Google App Passwords: https://support.google.com/accounts/answer/185833
