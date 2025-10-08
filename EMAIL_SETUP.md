# Email Setup Instructions

## Setting up Email Functionality

The contact form uses Nodemailer to send emails. Follow these steps to configure it:

### 1. Create Environment Variables

Copy `.env.example` to `.env` and fill in your email settings:

```bash
cp .env.example .env
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Generate an "App Password" for this application
4. Use your Gmail address as `SMTP_USER`
5. Use the generated app password as `SMTP_PASS`

### 3. Other Email Providers

For other providers, use these settings:

- **Outlook**: `smtp-mail.outlook.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Custom SMTP**: Your provider's SMTP settings

### 4. Environment Variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
AGENCY_EMAIL=mowryagency@gmail.com
```

### 5. Testing

The contact form will:

- Send a lead notification to `AGENCY_EMAIL`
- Send a confirmation email to the customer
- Handle errors gracefully with fallback to phone contact

### 6. Production Deployment

Make sure to set these environment variables in your hosting platform:

- Netlify: Site settings → Environment variables
- Vercel: Project settings → Environment Variables
- Railway/Heroku: Config vars

## Features

- ✅ **Lead notifications** to agency email
- ✅ **Customer confirmations** with professional branding
- ✅ **Form validation** and error handling
- ✅ **Phone fallback** if email fails
- ✅ **Spam protection** with server-side validation
