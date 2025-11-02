# Spotlight Nuxt - Mowry Agency Website

[![Deployed Project](https://img.shields.io/badge/Live%20Site-mowryagency.com-blue?style=for-the-badge)](https://mowryagency.com)
[![CI](https://github.com/jordanbmowry/mowry-agency/actions/workflows/ci.yml/badge.svg)](https://github.com/jordanbmowry/mowry-agency/actions/workflows/ci.yml)
[![Biome](https://github.com/jordanbmowry/mowry-agency/actions/workflows/biome.yml/badge.svg)](https://github.com/jordanbmowry/mowry-agency/actions/workflows/biome.yml)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

A modern digital agency website built with Nuxt 3, featuring a pixel-perfect migration from the [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI. This project demonstrates advanced Nuxt.js capabilities with server-side rendering, composable-driven architecture, and functional programming patterns for optimal code reusability and maintainability.

## 🚀 Live Demo

**Production Site**: [https://mowryagency.com](https://mowryagency.com)

## ✨ Features

### Core Features

- **Server-Side Rendering (SSR)** for optimal SEO performance
- **Responsive Design** with mobile-first approach
- **Dark/Light Theme** switching with smooth transitions
- **Optimized Images** using Nuxt Image with WebP format
- **Accessibility First** with ARIA labels and keyboard navigation
- **Performance Optimized** with lazy loading and code splitting

### Advanced Features

- **Multi-Step Quote Form** with real-time validation and progress tracking
- **Lead Management Dashboard** with search, filtering, and CSV export
- **TCPA Compliance** built-in with audit trail
- **Email Notifications** via Resend API with branded templates
- **Composable Architecture** with reusable functional components
- **Type-Safe Database** operations with TypeScript and Supabase

## 🛠 Tech Stack

### Frontend

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Nuxt UI for consistent, accessible components
- **Theme Management**: Nuxt Color Mode for theme switching
- **Image Optimization**: Nuxt Image with automatic WebP conversion
- **Animation**: @vueuse/motion and @formkit/auto-animate

### Backend

- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Email**: Resend API for transactional emails
- **Authentication**: Supabase Auth for admin dashboard
- **File Storage**: Supabase Storage for resume uploads

### Development

- **TypeScript**: Full type safety across the stack
- **Code Quality**: Biome.js for linting and formatting
- **Testing**: Vitest for unit tests, Playwright for E2E
- **CI/CD**: GitHub Actions for automated testing and quality checks
- **Deployment**: Netlify with SSR and edge functions
- **Version Control**: Git with conventional commits

### Code Quality & Standards

This project uses [Biome.js](https://biomejs.dev/) for fast, consistent code formatting and linting:

- **Lightning Fast**: Rust-based tooling for optimal performance (95% faster than ESLint)
- **Zero Configuration**: Works out of the box with sensible defaults
- **Comprehensive**: Handles both linting and formatting in one tool
- **Vue Support**: Full support for Vue SFC files and TypeScript
- **CI Optimized**: Uses `biome ci` command for better CI/CD integration

#### Available Scripts

```bash
# Check for linting and formatting issues
npm run lint

# Check formatting only
npm run format

# Auto-fix linting issues (review changes first)
npm run lint:fix

# Auto-fix formatting issues
npm run format:fix
```

#### CI/CD Integration

The project includes automated checks via GitHub Actions:
- **Biome Workflow**: Dedicated workflow using the official Biome action for maximum performance
- **Linting**: Ensures code follows best practices and catches potential issues
- **Formatting**: Maintains consistent code style across the entire codebase
- **Testing**: Runs unit and E2E tests in parallel
- **Build**: Verifies production build success

The CI pipeline is optimized for speed by using the official `biomejs/setup-biome` action, which bypasses Node.js installation for linting/formatting checks.

## 🏗 Architecture

### Composables (Functional Programming)

The project follows functional programming principles with pure, reusable composables:

#### **Form Management**

- `useQuoteForm.ts` - Quote form specific logic with multi-step validation
- `useJoiValidation.ts` - Server-synchronized validation using Joi schemas

#### **Error Handling**

- `useErrorHandler.ts` - Centralized error handling with categorization, user-friendly messages, retry logic, and server-side logging

#### **Data Management**

- `usePagination.ts` - Reusable pagination with computed properties
- `useLeadsFilters.ts` - Debounced search and filtering with pure functions
- `useLeadsExport.ts` - CSV export with type-safe data transformation
- `useFormatters.ts` - Human-friendly formatting for database values

#### **UI Utilities**

- `useCitiesData.ts` - Location data management

### Component Architecture

#### **Form Components** (`components/form/`)

Reusable, accessible form components:

- `FormInput.vue` - Text, email, tel, date inputs with validation
- `FormSelect.vue` - Dropdown with keyboard navigation
- `FormTextarea.vue` - Multi-line input with character count

#### **Quote Form Components** (`components/quote/`)

Multi-step form broken into logical pieces:

- `PersonalInfoStep.vue` - Name, contact, DOB, location
- `HealthInfoStep.vue` - Height, weight, health conditions
- `CoverageInfoStep.vue` - Coverage type, TCPA consent
- `SuccessMessage.vue` - Post-submission confirmation

#### **Admin Components** (`components/admin/`)

Dashboard management components:

- `LeadsFilters.vue` - Search and filter controls
- `LeadsTable.vue` - Responsive leads display with status badges
- `LeadsPagination.vue` - Page navigation with mobile/desktop layouts

### Server Architecture

#### **API Routes** (`server/api/`)

- `quote.post.ts` - Quote submission with validation and email
- `leads/index.get.ts` - Paginated leads with filtering
- `leads/[id].get.ts` - Single lead details
- `leads/export.get.ts` - CSV export generation
- `unsubscribe.get.ts` - Email unsubscribe handling

#### **Utilities** (`server/utils/`)

- `form-utils.ts` - Pure validation and transformation functions
- `email-service-vue.ts` - Email sending with Vue templates

## 📁 Project Structure

```
spotlight-nuxt/
├── app/
│   ├── components/
│   │   ├── form/                    # Reusable form components
│   │   │   ├── FormInput.vue
│   │   │   ├── FormSelect.vue
│   │   │   └── FormTextarea.vue
│   │   ├── quote/                   # Quote form steps
│   │   │   ├── PersonalInfoStep.vue
│   │   │   ├── HealthInfoStep.vue
│   │   │   ├── CoverageInfoStep.vue
│   │   │   └── SuccessMessage.vue
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── LeadsFilters.vue
│   │   │   ├── LeadsTable.vue
│   │   │   └── LeadsPagination.vue
│   │   ├── Header.vue               # Navigation header
│   │   ├── Footer.vue               # Site footer
│   │   ├── ThemeToggle.vue          # Dark/light toggle
│   │   └── Container.vue            # Layout wrapper
│   ├── composables/
│   │   ├── useQuoteForm.ts          # Quote form state & validation
│   │   ├── useFormValidation.ts     # Pure validation functions
│   │   ├── useFormSubmission.ts     # Form submission handler
│   │   ├── usePagination.ts         # Pagination logic
│   │   ├── useLeadsFilters.ts       # Search & filtering
│   │   ├── useLeadsExport.ts        # CSV export
│   │   ├── useDatabase.ts           # Supabase operations
│   │   └── useApiClient.ts          # HTTP client
│   ├── pages/
│   │   ├── index.vue                # Homepage
│   │   ├── about.vue                # About page
│   │   ├── quote.vue                # Quote request
│   │   ├── join-us.vue              # Career applications
│   │   ├── admin/
│   │   │   ├── index.vue            # Leads dashboard
│   │   │   ├── [id].vue             # Lead detail view
│   │   │   └── login.vue            # Admin login
│   │   └── articles/                # Blog articles
│   ├── layouts/
│   │   └── default.vue              # Main layout
│   ├── middleware/
│   │   └── admin.ts                 # Auth middleware
│   ├── types/
│   │   ├── database.types.ts        # Supabase generated types
│   │   └── validation.ts            # Form validation types
│   ├── utils/
│   │   └── dateUtils.ts             # Date manipulation utilities
│   └── assets/
│       ├── css/
│       │   └── main.css             # Global styles
│       └── images/                  # Image assets
├── server/
│   ├── api/
│   │   ├── quote.post.ts            # Quote submission
│   │   ├── leads/
│   │   │   ├── index.get.ts         # List leads
│   │   │   ├── [id].get.ts          # Single lead
│   │   │   └── export.get.ts        # CSV export
│   │   └── unsubscribe.get.ts       # Email unsubscribe
│   ├── utils/
│   │   ├── form-utils.ts            # Validation helpers
│   │   └── email-service-vue.ts     # Email service
│   └── middleware/                  # Server middleware
├── emails/                          # Vue email templates
│   ├── AgencyNotification.vue
│   └── CustomerConfirmation.vue
├── supabase/
│   ├── config.toml                  # Supabase configuration
│   └── migrations/                  # Database migrations
├── test/                            # Unit tests
│   ├── components/
│   ├── composables/
│   └── api/
├── tests/                           # E2E tests
│   └── e2e/
├── public/                          # Static assets
├── agency_assets/                   # Agency images
├── nuxt.config.ts                   # Nuxt configuration
├── tailwind.config.js               # Tailwind configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm, yarn, or pnpm package manager
- Supabase account (for database and auth)
- Resend account (for email notifications)
- Access to [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository for database management

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd spotlight-nuxt
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Database Setup:**

**Important**: This project uses a centralized database management system. The database schema and migrations are managed in the separate [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository.

```bash
# Database management commands (delegates to mowry_leads_database)
npm run db:types    # Generate TypeScript types
npm run db:migrate  # Apply database migrations
npm run db:reset    # Reset database (development only)
npm run db:start    # Start local Supabase instance
npm run db:stop     # Stop local Supabase instance
npm run db:status   # Check database status
```

4. **Set up environment variables:**

```bash
cp .env.example .env
```

5. **Configure your `.env` file:**

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key

# SMTP Configuration (for Vue Email)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your_resend_api_key

# Agency Configuration
AGENCY_EMAIL=your_agency_email@domain.com
AGENCY_PHONE=(930) 322-1962
AGENCY_ADDRESS=Your Agency Address
AGENCY_WEBSITE=https://mowryagency.com
AGENCY_NPN=Your_NPN_Number

# Public Runtime Config
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_AGENCY_PHONE=(930) 322-1962
NUXT_PUBLIC_AGENCY_EMAIL=your_agency_email@domain.com
```

6. **Set up Supabase database:**

**Database management is now centralized!** This project no longer manages database migrations directly. Instead, all database operations are delegated to the [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository.

```bash
# Start local database
npm run db:start

# Apply all migrations
npm run db:migrate

# Generate TypeScript types
npm run db:types
```

7. **Start the development server:**

```bash
npm run dev
```

8. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Management

This project uses a **centralized database management system** via the [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository. This approach provides:

### Benefits
- ✅ **Single source of truth** for database schema
- ✅ **Coordinated migrations** across multiple projects
- ✅ **Consistent type generation** and syncing
- ✅ **Automated testing** of database changes
- ✅ **Production deployment safety**

### Available Commands
```bash
npm run db:types     # Generate TypeScript types from database
npm run db:migrate   # Apply pending migrations
npm run db:reset     # Reset database (development only)
npm run db:start     # Start local Supabase instance
npm run db:stop      # Stop local Supabase instance
npm run db:status    # Check database connection status
```

### Database Structure
The database contains exactly **6 tables**:
- `leads` - Primary leads management table with TCPA compliance
- `profiles` - User profile management
- `unsubscribes` - Email unsubscribe tracking
- `leads_compliance_report` - TCPA compliance reporting
- `leads_compliance_report_runs` - Compliance report execution history
- `_owner_required_migrations` - Supabase internal migration tracking

For detailed database documentation, migration guides, and setup instructions, see the [mowry_leads_database repository](https://github.com/jordanbmowry/mowry_leads_database).

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production with SSR
npm run preview      # Preview production build locally
npm run generate     # Generate static site (SSG)

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm run test         # Run Vitest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI mode

# Database
npm run db:types     # Generate TypeScript types from Supabase
npm run db:migrate   # Run database migrations
```

## 🎯 Code Quality & Best Practices

### Functional Programming Patterns

The codebase follows functional programming principles for maximum reusability:

#### **Pure Functions**

```typescript
// Example from useLeadsFilters.ts
export const applyLeadsFilters = (query: any, filters: FilterState): any => {
  let result = query;

  if (filters.searchTerm) {
    result = result.or(
      `first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%`
    );
  }

  if (filters.statusFilter) {
    result = result.eq('status', filters.statusFilter);
  }

  return result; // No side effects
};
```

#### **Composition Over Inheritance**

```typescript
// Composable combines multiple concerns
export const useQuoteForm = () => {
  const { form, errors } = useFormState();
  const { validate } = useFormValidation();
  const { submit } = useFormSubmission();

  return { form, errors, validate, submit };
};
```

#### **Immutability**

```typescript
// State updates create new objects
const updateFilters = (newFilters: Partial<FilterState>) => {
  filters.value = { ...filters.value, ...newFilters };
};
```

### Component Design

#### **Single Responsibility**

Each component has one clear purpose:

- `FormInput.vue` - Renders and validates a single input
- `PersonalInfoStep.vue` - Handles personal information collection
- `LeadsTable.vue` - Displays leads data

#### **Props-Down, Events-Up**

```vue
<!-- Parent controls state, child emits events -->
<FormInput
  v-model="form.email"
  :error="errors.email"
  @blur="validateField('email')"
/>
```

#### **Composable Logic Extraction**

Complex logic lives in composables, not components:

```vue
<script setup>
const { form, validate, submit } = useQuoteForm();
// Component focuses on presentation
</script>
```

### TypeScript Standards

#### **Strict Type Safety**

```typescript
// Explicit interfaces for all data structures
interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  // ... all fields typed
}

// Type-safe composable return
export const useQuoteForm = (): QuoteFormReturn => {
  // ...
};
```

#### **Generic Functions**

```typescript
// Reusable with type parameter
const hasRequiredFieldsForStep = <T extends object>(
  form: T,
  fields: (keyof T)[]
): boolean => {
  return fields.every((field) => {
    const value = form[field];
    return typeof value === 'boolean' ? value : String(value).trim() !== '';
  });
};
```

### Performance Optimization

#### **Computed Properties**

```typescript
// Cached reactive values
const isStep1Valid = computed(
  () => hasRequiredFields(form, step1Fields) && hasNoErrors(errors, step1Fields)
);
```

#### **Debounced Search**

```typescript
import { refDebounced } from '@vueuse/core';

const searchTerm = ref('');
const debouncedSearch = refDebounced(searchTerm, 300);

watch(debouncedSearch, () => {
  fetchLeads(); // Only called after 300ms pause
});
```

### Error Handling System

The project uses a centralized error handling system for consistent, user-friendly error management:

#### **Core Features**

- **Automatic Categorization**: Errors are classified (validation, network, database, auth, etc.)
- **User-Friendly Messages**: Technical errors converted to readable messages automatically
- **Retry Logic**: Failed operations can retry with exponential backoff
- **Server Logging**: Critical errors logged to server for debugging
- **Context Tracking**: Rich debugging context with every error

#### **Basic Usage**

```typescript
import { useErrorHandler } from '~/composables/useErrorHandler';

const { handleAsync } = useErrorHandler();

const fetchData = async () => {
  const { data, error } = await handleAsync(
    async () => await $fetch('/api/data'),
    {
      showNotification: true, // Show toast on error
      logToServer: true, // Log critical errors
    },
    {
      operation: 'fetchData', // Debugging context
      userId: user.id,
    }
  );

  if (error) {
    // Error already handled with user-friendly message
    return;
  }

  // Use data safely
};
```

#### **With Retry Logic**

```typescript
const { handleAsyncWithRetry } = useErrorHandler();

const { data, error } = await handleAsyncWithRetry(
  async () => await saveToDatabase(),
  {
    maxRetries: 3, // Retry up to 3 times
    retryDelay: 1000, // 1 second initial delay
    retryDelayMultiplier: 2, // Exponential backoff
    showNotification: true,
    logToServer: true,
  }
);
```

See [ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md) for complete documentation.

#### **Lazy Loading**

```typescript
// Components loaded only when needed
const AdminDashboard = defineAsyncComponent(
  () => import('~/components/admin/Dashboard.vue')
);
```

## 🎨 Design System

### Color Palette

The site uses a sophisticated color system supporting both light and dark themes:

- **Primary**: Zinc color scale (50-950) for neutral UI elements
- **Accent**: Teal for CTAs, focus states, and interactive elements
- **Semantic Colors**:
  - Success: Green for confirmations
  - Warning: Amber for alerts and important info
  - Error: Red for validation errors
  - Info: Blue for informational content

### Typography

- **Font Family**: Inter variable font for optimal readability
- **Scale**: Tailwind's typography scale with custom line heights
- **Hierarchy**: Clear visual hierarchy with consistent spacing
- **Responsive**: Font sizes adapt to screen size

### Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape, tablet portrait
md: '768px'   // Tablet landscape
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large screens
```

#### Layout Behavior

- **Mobile** (`< 768px`): Single column, hamburger menu, stacked forms
- **Tablet** (`768px - 1024px`): Two-column grids, desktop navigation appears
- **Desktop** (`> 1024px`): Multi-column layouts, sidebars, expanded views

## 💼 Quote Form Implementation

### Multi-Step Architecture

The quote form is broken into three logical steps:

#### **Step 1: Personal Information**

- Name (first/last)
- Contact (email/phone)
- Demographics (DOB, sex)
- Location (city, state)

#### **Step 2: Health Information**

- Physical metrics (height, weight)
- Health conditions
- Current medications

#### **Step 3: Coverage & Consent**

- Coverage type selection
- TCPA consent (required)
- Email marketing consent (optional)

### Form Validation Strategy

#### **Real-Time Validation**

```typescript
// Validation triggers on blur
<FormInput
  v-model="form.email"
  :error="errors.email"
  @blur="validateField('email')"
/>
```

#### **Step-Level Validation**

```typescript
// Computed property checks all fields in step
const isStep1Valid = computed(
  () =>
    hasRequiredFieldsForStep(form, step1Fields) &&
    hasNoErrorsForFields(errors, step1Fields)
);
```

#### **Submit-Time Validation**

```typescript
// Final validation before submission
const submitForm = async () => {
  if (!isFormValid.value) {
    return { success: false, error: 'Please complete all required fields' };
  }
  // ... submit logic
};
```

### TCPA Compliance

#### **Consent Tracking**

```typescript
interface QuoteFormData {
  tcpaConsent: boolean; // Required for submission
  emailMarketingConsent: boolean; // Optional
  formVersion: string; // Track form version
}
```

#### **Audit Trail**

```typescript
// Server-side tracking in database
const leadData = {
  ...formData,
  consent_timestamp: new Date().toISOString(),
  consent_ip_address: clientInfo.ipAddress,
  consent_user_agent: clientInfo.userAgent,
  consent_text: TCPA_CONSENT_TEXT,
};
```

### Error Handling

#### **Client-Side Errors**

- Field validation errors display inline
- Step validation prevents progression
- Network errors show user-friendly messages

#### **Server-Side Errors**

```typescript
// Graceful handling of duplicate submissions
if (error.code === 'duplicate_email') {
  return {
    success: true,
    isDuplicate: true,
    message: "We're Already Working on Your Quote!",
  };
}
```

## 🗄 Database Schema

### Leads Table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  height NUMERIC NOT NULL CHECK (height >= 36 AND height <= 96),
  weight NUMERIC NOT NULL CHECK (weight >= 50 AND weight <= 500),
  health_conditions TEXT NOT NULL,
  medications TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  message TEXT,

  -- TCPA Compliance
  tcpa_consent BOOLEAN NOT NULL DEFAULT FALSE,
  email_marketing_consent BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  consent_ip_address TEXT,
  consent_user_agent TEXT,
  consent_text TEXT,

  -- Metadata
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  form_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT leads_email_unique UNIQUE (email)
);

-- Indexes for common queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Admin can see all leads
CREATE POLICY "Admin users can view all leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Public can only insert (quote submission)
CREATE POLICY "Anyone can submit quotes"
  ON leads FOR INSERT
  WITH CHECK (true);
```

## 🔧 Configuration

### Nuxt Configuration

Key configuration highlights in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  ssr: true,                    // Server-side rendering
  css: ['~/assets/css/main.css'], // Global styles
  modules: [
    '@nuxt/image',              // Image optimization
    '@nuxtjs/color-mode',       // Theme switching
    '@nuxtjs/supabase',         # Database integration
    '@headlessui/vue'           // UI components
  ],
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL
    }
  }
})
```

### Database Schema

The project uses Supabase with the following main tables:

- **quote_requests**: Store customer quote submissions
- **services**: Available agency services
- **lead_status**: Track lead progression

## 📧 Email System

### Vue Email Templates

The project uses Vue components for emails, providing:

- **Type Safety**: Full TypeScript support
- **Reusability**: Component-based architecture
- **Testing**: Unit testable email templates
- **Preview**: Development preview mode

#### **Customer Confirmation Email**

```vue
<!-- emails/CustomerConfirmation.vue -->
<template>
  <Html>
    <Head>
      <title>Your Life Insurance Quote Request</title>
    </Head>
    <Body class="bg-zinc-50 font-sans">
      <Container class="mx-auto max-w-2xl">
        <Section class="bg-white p-8 rounded-lg">
          <Heading>Thank You, {{ firstName }}!</Heading>
          <Text>We've received your quote request...</Text>
          <!-- Branded, professional email content -->
        </Section>
      </Container>
    </Body>
  </Html>
</template>
```

#### **Agency Notification Email**

- Lead details formatted for quick review
- Direct links to admin dashboard
- Status update capabilities

### Email Service Implementation

```typescript
// server/utils/email-service-vue.ts
export const sendQuoteEmails = async (
  config: EmailConfig,
  lead: Lead,
  agency: AgencyInfo
) => {
  // Render Vue components to HTML
  const customerHtml = await renderVueEmail(CustomerConfirmation, { lead });
  const agencyHtml = await renderVueEmail(AgencyNotification, { lead });

  // Send via Resend API
  const results = await Promise.allSettled([
    sendEmail({ to: lead.email, html: customerHtml }),
    sendEmail({ to: agency.email, html: agencyHtml }),
  ]);

  return { customerResult, agencyResult };
};
```

## 🚀 Deployment

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Environment Variables

#### **Production (Netlify Dashboard)**

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Email (Resend)
RESEND_API_KEY=re_xxxxx
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxxxx

# Agency Info
AGENCY_EMAIL=admin@mowryagency.com
AGENCY_PHONE=(930) 322-1962
AGENCY_ADDRESS=123 Main St, City, ST 12345
AGENCY_WEBSITE=https://mowryagency.com
AGENCY_NPN=12345678

# Public Config
NUXT_PUBLIC_SITE_URL=https://mowryagency.com
NUXT_PUBLIC_AGENCY_PHONE=(930) 322-1962
NUXT_PUBLIC_AGENCY_EMAIL=admin@mowryagency.com
```

### DNS Configuration

#### **MX Records** (for email delivery)

```
mowryagency.com  MX  10  mx1.porkbun.com
mowryagency.com  MX  20  mx2.porkbun.com
mowryagency.com  MX  30  mx3.porkbun.com
mowryagency.com  MX  40  mx4.porkbun.com
```

#### **SSL/TLS**

Automatically managed by Netlify with Let's Encrypt

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run on production
- [ ] RLS policies enabled in Supabase
- [ ] Email templates tested
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Performance testing completed (Lighthouse)
- [ ] Error tracking configured (Sentry optional)

## 🧪 Testing

### Unit Tests (Vitest)

#### **Composable Testing**

```typescript
// test/composables/useQuoteForm.test.ts
import { describe, it, expect } from 'vitest';
import { useQuoteForm } from '~/composables/useQuoteForm';

describe('useQuoteForm', () => {
  it('validates email correctly', () => {
    const { form, errors, validateField } = useQuoteForm();

    form.email = 'invalid-email';
    validateField('email');

    expect(errors.email).toBe('Please enter a valid email address');
  });

  it('calculates step validation', () => {
    const { form, isStep1Valid } = useQuoteForm();

    expect(isStep1Valid.value).toBe(false);

    // Fill required fields
    form.firstName = 'John';
    form.lastName = 'Doe';
    // ... more fields

    expect(isStep1Valid.value).toBe(true);
  });
});
```

#### **Component Testing**

```typescript
// test/components/FormInput.test.ts
import { mount } from '@vue/test-utils';
import FormInput from '~/components/form/FormInput.vue';

describe('FormInput', () => {
  it('displays error message when provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test',
        label: 'Test Field',
        modelValue: '',
        error: 'This field is required',
      },
    });

    expect(wrapper.text()).toContain('This field is required');
  });

  it('emits update on input', async () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test',
        label: 'Test Field',
        modelValue: '',
      },
    });

    await wrapper.find('input').setValue('new value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/quote-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Quote Form', () => {
  test('completes multi-step submission', async ({ page }) => {
    await page.goto('/quote');

    // Step 1: Personal Info
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#phone', '5551234567');
    await page.fill('#dateOfBirth', '1990-01-01');
    await page.selectOption('#sex', 'male');
    await page.fill('#city', 'Los Angeles');
    await page.fill('#state', 'CA');
    await page.click('button:has-text("Next")');

    // Step 2: Health Info
    await page.fill('#height', '70');
    await page.fill('#weight', '180');
    await page.fill('#healthConditions', 'None');
    await page.fill('#medications', 'None');
    await page.click('button:has-text("Next")');

    // Step 3: Coverage & Consent
    await page.selectOption('#coverageType', 'term-life');
    await page.check('#tcpaConsent');
    await page.click('button:has-text("Submit")');

    // Verify success message
    await expect(page.locator('text=Thank You')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/quote');

    await page.click('button:has-text("Next")');

    // Should not progress without filling fields
    await expect(page.locator('#firstName')).toBeVisible();
  });
});
```

### Integration Tests

```typescript
// test/integration/api.test.ts
describe('/api/quote', () => {
  it('creates lead and sends emails', async () => {
    const response = await $fetch('/api/quote', {
      method: 'POST',
      body: validQuoteData,
    });

    expect(response.success).toBe(true);
    expect(response.leadId).toBeDefined();
    expect(response.emailStatus.customerEmail).toBe('sent');
  });

  it('handles duplicate email submissions', async () => {
    // Submit once
    await $fetch('/api/quote', {
      method: 'POST',
      body: validQuoteData,
    });

    // Submit again with same email
    const response = await $fetch('/api/quote', {
      method: 'POST',
      body: validQuoteData,
    });

    expect(response.isDuplicate).toBe(true);
    expect(response.message).toContain('Already Working');
  });
});
```

## 📈 Performance

### Lighthouse Scores

Target scores (all ≥ 95):

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Strategies

#### **Code Splitting**

```typescript
// Automatic route-based splitting
// pages/admin/index.vue loaded only when accessed
const AdminDashboard = defineAsyncComponent(
  () => import('~/pages/admin/index.vue')
);
```

#### **Image Optimization**

```vue
<NuxtImg
  src="/images/hero.jpg"
  alt="Hero image"
  width="1200"
  height="800"
  format="webp"
  quality="80"
  loading="lazy"
  sizes="sm:100vw md:80vw lg:1200px"
/>
```

#### **Lazy Hydration**

```vue
<LazyHydrate when-visible>
  <HeavyComponent />
</LazyHydrate>
```

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔐 Security

### Best Practices Implemented

#### **Environment Variables**

- Sensitive data never committed to repository
- `.env.example` provides template without secrets
- Different keys for development and production

#### **Database Security**

```sql
-- Row Level Security enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies restrict access
CREATE POLICY "Admins only"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');
```

#### **API Protection**

```typescript
// Input validation on all endpoints
if (!body.email || !validateEmail(body.email)) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid email format',
  });
}

// SQL injection prevention via parameterized queries
const { data } = await supabase.from('leads').insert([sanitizedData]);
```

#### **HTTPS Enforcement**

- SSL certificates via Netlify/Let's Encrypt
- HSTS headers configured
- Automatic HTTP to HTTPS redirect

#### **Content Security Policy**

```typescript
// Headers in netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### **Authentication**

- Supabase Auth for admin dashboard
- JWT-based session management
- Protected routes with middleware

```typescript
// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/admin/login');
  }
});
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**

```bash
git clone https://github.com/your-username/spotlight-nuxt.git
cd spotlight-nuxt
```

2. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

3. **Make your changes**

- Follow existing code style
- Write unit tests for new features
- Update documentation as needed

4. **Run quality checks**

```bash
npm run lint          # Check for linting errors
npm run type-check    # TypeScript validation
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
```

5. **Commit your changes**

```bash
git add .
git commit -m "feat: add new feature"
# Follow conventional commits format
```

6. **Push and create Pull Request**

```bash
git push origin feature/your-feature-name
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug in quote form
docs: update README
style: format code with prettier
refactor: extract validation to composable
test: add tests for useQuoteForm
chore: update dependencies
```

### Code Style

#### **Vue Components**

```vue
<script setup lang="ts">
// Imports first
import { ref, computed } from 'vue';
import type { QuoteFormData } from '~/types';

// Props and emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const { form, errors } = useQuoteForm();

// State
const loading = ref(false);

// Computed
const isValid = computed(() => form.firstName !== '');

// Methods
const handleSubmit = async () => {
  // Implementation
};
</script>

<template>
  <!-- Template with proper indentation -->
</template>
```

#### **TypeScript**

```typescript
// Explicit types for all exports
export interface FormData {
  name: string;
  email: string;
}

// Pure functions with type annotations
export const validateEmail = (email: string): string => {
  // Implementation
};

// Avoid 'any', use 'unknown' if necessary
const parseData = (data: unknown): FormData => {
  // Type guard
  if (!isFormData(data)) {
    throw new Error('Invalid data');
  }
  return data;
};
```

### Pull Request Guidelines

- **Title**: Clear, descriptive title following conventional commits
- **Description**: Explain what and why, not how
- **Screenshots**: For UI changes, include before/after screenshots
- **Tests**: Ensure all tests pass
- **Documentation**: Update docs for API changes

### What to Contribute

#### **Bug Fixes**

- Fix reported issues
- Improve error handling
- Enhance validation

#### **New Features**

- Additional form fields
- New composables
- UI components
- Admin dashboard features

#### **Documentation**

- Code comments
- README improvements
- API documentation
- Setup guides

#### **Performance**

- Optimization improvements
- Bundle size reduction
- Lighthouse score improvements

#### **Testing**

- Increase test coverage
- Add E2E test scenarios
- Integration tests

## 📚 Documentation

### Official Docs

- [Nuxt 3](https://nuxt.com/) - Full-stack framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Supabase](https://supabase.com/docs) - Backend as a service
- [Resend](https://resend.com/docs) - Email API
- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety

### Related Guides

- [Nuxt Composables](https://nuxt.com/docs/guide/directory-structure/composables)
- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Functional Programming in TypeScript](https://github.com/gcanti/fp-ts)
- [Headless UI](https://headlessui.com/) - Unstyled accessible components

## 🎓 Learning Resources

### Video Tutorials

- [Nuxt 3 Fundamentals](https://vueschool.io/courses/nuxt-js-3-fundamentals)
- [TypeScript for Vue Developers](https://vueschool.io/courses/typescript-for-vue-js-3)
- [Functional Programming in JavaScript](https://frontendmasters.com/courses/functional-javascript-v3/)

### Articles

- [Composables Best Practices](https://vuejs.org/guide/reusability/composables.html)
- [Form Validation Patterns](https://vuelidate-next.netlify.app/)
- [Multi-Step Forms in Vue](https://blog.logrocket.com/building-multi-step-form-vue/)

## 🐛 Troubleshooting

### Common Issues

#### **Database Connection Errors**

```bash
# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_KEY

# Verify connection
npm run db:test
```

#### **Email Not Sending**

```bash
# Check SMTP configuration
echo $SMTP_HOST
echo $SMTP_PORT

# Test email service
npm run test:email
```

#### **Build Failures**

```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt .output
npm install
npm run build
```

#### **Type Errors**

```bash
# Regenerate database types
npm run db:types

# Check for TypeScript errors
npm run type-check
```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: admin@mowryagency.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- **Design**: Based on [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI
- **Icons**: [Heroicons](https://heroicons.com/) by the Tailwind team
- **Font**: [Inter](https://rsms.me/inter/) by Rasmus Andersson
- **Inspiration**: Modern agency websites and SaaS products

## 📞 Contact

**Mowry Agency**

- **Website**: [https://mowryagency.com](https://mowryagency.com)
- **Email**: admin@mowryagency.com
- **Phone**: (930) 322-1962

---

**Built with ❤️ using Nuxt 3, Vue 3, and TypeScript**
