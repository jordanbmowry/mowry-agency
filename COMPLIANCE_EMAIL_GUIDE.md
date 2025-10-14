# Compliance Email Templates & License Management

This document outlines the compliant email template system for Mowry Agency and how to maintain license information across the application.

## 📋 Compliance Features

### Customer Confirmation Email (`emails/CustomerConfirmation.vue`)

The customer-facing quote confirmation email includes all required compliance elements:

**✅ CAN-SPAM Compliance:**

- Clear business identification (Mowry Agency owned by Mowry Digital Enterprise LLC)
- Complete contact information (email, phone, address)
- Unsubscribe link with proper language
- Accurate "From" and "Subject" information

**✅ Insurance Licensing Compliance:**

- Complete list of licensed states with license numbers
- National Producer Number (NPN) disclosure
- Licensed business entity information
- Disclaimers about quotes vs. policies

**✅ TCPA Compliance:**

- Professional communication standards
- Clear identification of business purpose
- Opt-out language in unsubscribe section

## 🏗️ System Architecture

### Centralized License Management (`app/constants/licenses.ts`)

All license information is stored in a single, maintainable location:

```typescript
// Easy to update when licenses change
export const STATE_LICENSES: LicenseInfo[] = [
  { state: 'Alabama', stateCode: 'AL', licenseNumber: '3003564119' },
  // ... all other states
];

export const BUSINESS_INFO: BusinessInfo = {
  businessName: 'Mowry Agency',
  ownerEntity: 'Mowry Digital Enterprise LLC',
  npn: getAgencyNpn(), // Uses AGENCY_NPN environment variable
  // ... other business details
};
```

### Reusable License Component (`app/components/LicenseInformation.vue`)

A flexible Vue component that displays license information with different styling options:

```vue
<!-- For emails -->
<LicenseInformation variant="email" display-format="short" />

<!-- For website footer -->
<LicenseInformation variant="footer" compact display-format="short" />

<!-- For legal pages -->
<LicenseInformation variant="website" display-format="full" />
```

## 🔧 Maintenance Instructions

### Adding New State Licenses

1. **Update the constants file:**

   ```typescript
   // In app/constants/licenses.ts
   export const STATE_LICENSES: LicenseInfo[] = [
     // ... existing licenses
     { state: 'New State', stateCode: 'NS', licenseNumber: '1234567' },
   ];
   ```

2. **No other changes needed** - the license information will automatically appear in:
   - Customer confirmation emails
   - Website footer
   - Any page using the LicenseInformation component

### Updating Business Information

1. **Configure NPN via environment variable:**

   ```bash
   # In .env file
   AGENCY_NPN=your_actual_npn_number
   ```

   ```typescript
   // In app/constants/licenses.ts
   export const BUSINESS_INFO: BusinessInfo = {
     // ...
     npn: getAgencyNpn(), // Uses AGENCY_NPN environment variable
   };
   ```

2. **Update business address:**
   ```bash
   # In .env file
   AGENCY_ADDRESS="123 Main St, Suite 100, Austin, TX 78701"
   ```

### Modifying Email Templates

The Vue Email templates use modern Vue 3 composition API and Tailwind CSS:

```vue
<script setup lang="ts">
import { BUSINESS_INFO, formatLicenseDisplay } from '~/constants/licenses';
</script>

<template>
  <Section class="bg-zinc-50 p-6 rounded-lg">
    <Text class="text-sm">
      {{ BUSINESS_INFO.businessName }} is licensed in:
      {{ formatLicenseDisplay('short') }}
    </Text>
  </Section>
</template>
```

## 📧 Email Template System

### CustomerConfirmation.vue Structure

1. **Header:** Professional branding with agency logo
2. **Greeting:** Personalized with customer's first name
3. **Content:** Quote confirmation and next steps
4. **Contact Info:** Complete business contact details
5. **Licensing Section:** All required compliance information
6. **Footer:** Professional closing and unsubscribe link

### Agency Notification (Internal)

The `AgencyNotification.vue` template is for internal use and doesn't require the same compliance elements since it's not customer-facing.

## 🧪 Testing

### Template Verification Script

Run the test script to verify compliance:

```bash
node test-vue-email-templates.js
```

This script checks for:

- ✅ License information presence
- ✅ NPN disclosure
- ✅ Compliance disclaimers
- ✅ Unsubscribe functionality

### Manual Testing Checklist

**Before deploying email changes:**

1. **License Information:**
   - [ ] All licensed states are listed
   - [ ] License numbers are correct
   - [ ] NPN is displayed and current

2. **Contact Information:**
   - [ ] Business name and ownership entity
   - [ ] Email address is accurate
   - [ ] Phone number is current
   - [ ] Physical address is current

3. **Compliance Elements:**
   - [ ] Unsubscribe link works
   - [ ] Disclaimers are present
   - [ ] Professional tone maintained

4. **Email Client Testing:**
   - [ ] Gmail renders correctly
   - [ ] Outlook renders correctly
   - [ ] Mobile email apps display properly

## 🚨 Important Notes

### Required Updates

**Before going live, configure these environment variables:**

1. `AGENCY_NPN` → Set to your actual National Producer Number
2. `AGENCY_ADDRESS` → Set to your actual business address
3. `AGENCY_EMAIL`, `AGENCY_PHONE`, `AGENCY_WEBSITE` → Configure all agency contact information

### State Licensing Compliance

- Only market to residents of licensed states
- Ensure all license numbers are current
- Update immediately when licenses change or expire
- Monitor state regulatory requirements for changes

### Email Compliance Best Practices

- Test all emails before deployment
- Keep unsubscribe processing under 10 business days
- Maintain records of opt-outs
- Regular compliance audits recommended

## 📞 Support

For questions about:

- **License updates:** Contact your compliance team
- **Email technical issues:** Contact development team
- **Regulatory requirements:** Consult with legal counsel

---

**Last Updated:** October 14, 2025  
**Compliance Standard:** CAN-SPAM, TCPA, State DOI Requirements
