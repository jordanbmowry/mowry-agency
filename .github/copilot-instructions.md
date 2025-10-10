# GitHub Copilot Instructions - Mowry Agency

## Project Context

This is a **modern digital agency website** built with Nuxt 3, featuring a pixel-perfect migration from the [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI. The project demonstrates advanced Nuxt.js capabilities with server-side rendering, full-stack functionality, and optimal performance for a professional agency presence.

## Tech Stack & Architecture

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom design system
- **Database**: Supabase for quote form data storage and lead management
- **Email**: Resend API for transactional email notifications
- **UI Library**: Headless UI Vue for accessible components
- **Theme System**: Nuxt Color Mode for dark/light theme switching
- **Images**: Nuxt Image for optimized image handling
- **Testing**: Vitest for unit tests, Playwright for e2e testing
- **Deployment**: Netlify with SSR and custom domain configuration

## Key Design Principles

### 1. Professional Agency Branding

- Clean, modern design reflecting professional agency capabilities
- Consistent visual hierarchy and typography
- Strategic use of white space and color to guide user attention
- Mobile-first responsive design for all device types

### 2. Performance & SEO Optimization

- Server-side rendering for optimal SEO and page load speeds
- Image optimization with WebP format and lazy loading
- Code splitting and tree shaking for minimal bundle sizes
- Core Web Vitals optimization for search ranking

### 3. Lead Generation Focus

- Prominent quote request form with Supabase integration
- Email notification system for immediate lead follow-up
- Contact forms optimized for conversion
- Clear call-to-action placement throughout the site

## Component Architecture

### Header System

Complex responsive header with advanced features:

```vue
Header.vue (Main orchestrator) ├── Container.vue (Layout wrapper) ├── Avatar.vue
(User avatar with link) ├── AvatarContainer.vue (Styled avatar wrapper) ├──
ThemeToggle.vue (Dark/light mode toggle) ├── DesktopNavigation.vue (Desktop nav
menu) ├── MobileNavigation.vue (Mobile dropdown menu) ├── NavItem.vue
(Individual nav links) └── MobileNavItem.vue (Mobile nav links)
```

### Quote Form System

Full-stack quote request functionality:

```vue
QuoteForm.vue (Main form component) ├── FormInput.vue (Input field components)
├── FormSelect.vue (Service selection dropdown) ├── FormTextarea.vue (Message
textarea) ├── SubmitButton.vue (Loading state button) └── SuccessMessage.vue
(Confirmation display)
```

### Critical Features

1. **Scroll Animations**: Avatar scaling and header position changes
2. **Responsive Navigation**: Mobile/desktop navigation switching at 768px
3. **Theme Switching**: Seamless light/dark mode transitions
4. **Quote Form**: Multi-step form with validation and email notifications
5. **Database Integration**: Supabase for lead storage and management

## Development Guidelines

### Vue 3 Patterns

```vue
<!-- Use Composition API with TypeScript -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Use composables for reusable logic
const { $colorMode } = useNuxtApp();
const route = useRoute();
const supabase = useSupabaseClient();

// Define interfaces for type safety
interface QuoteRequest {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Use computed for reactive derived state
const isActive = computed(() => route.path === href);
</script>
```

### Database Patterns

```typescript
// Use Supabase composables
const supabase = useSupabaseClient();

// Type-safe database operations
const submitQuote = async (data: QuoteRequest) => {
  const { data: result, error } = await supabase
    .from('quote_requests')
    .insert(data)
    .select();

  if (error) throw error;
  return result;
};
```

### Email Integration

```typescript
// Server API route for email notifications
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  // Send customer confirmation
  await sendEmail({
    to: body.email,
    subject: 'Quote Request Confirmation',
    template: 'CustomerConfirmation',
    data: body,
  });

  // Send agency notification
  await sendEmail({
    to: 'admin@mowryagency.com',
    subject: 'New Quote Request',
    template: 'AgencyNotification',
    data: body,
  });
});
```

### Styling Conventions

```vue
<!-- Use Tailwind classes that match the agency aesthetic -->
<template>
  <div class="bg-zinc-50 dark:bg-black">
    <!-- Professional, clean design patterns -->
    <button
      class="rounded-lg bg-zinc-900 px-6 py-3 text-white shadow-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
    >
      Get Quote
    </button>
  </div>
</template>
```

## Responsive Design

### Breakpoints

- **Mobile**: `< 768px` - Mobile navigation, stacked layout
- **Tablet**: `768px - 1024px` - Desktop navigation appears
- **Desktop**: `> 1024px` - Full desktop layout with sidebars

### Key Responsive Behaviors

```vue
<!-- Mobile/Desktop navigation switching -->
<MobileNavigation class="pointer-events-auto md:hidden" />
<DesktopNavigation class="pointer-events-auto hidden md:block" />

<!-- Responsive quote form layout -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <FormInput v-model="form.name" label="Name" />
  <FormInput v-model="form.email" label="Email" />
</div>
```

## Full-Stack Integration

### Supabase Configuration

```sql
-- Quote requests table
CREATE TABLE quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
```

### API Routes

```typescript
// server/api/quote.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validation = await validateQuoteRequest(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form data',
    });
  }

  // Store in database
  const quote = await storeQuoteRequest(body);

  // Send notifications
  await sendEmailNotifications(body);

  return { success: true, id: quote.id };
});
```

## Testing Strategy

### Component Testing

```typescript
// Test quote form functionality
describe('QuoteForm Component', () => {
  test('validates required fields', async () => {
    const wrapper = mount(QuoteForm);
    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.error-message')).toBeTruthy();
  });

  test('submits form with valid data', async () => {
    const wrapper = mount(QuoteForm);

    await wrapper.find('input[name="name"]').setValue('John Doe');
    await wrapper.find('input[name="email"]').setValue('john@example.com');
    await wrapper.find('form').trigger('submit');

    expect(mockSubmitQuote).toHaveBeenCalled();
  });
});
```

### E2E Testing

```typescript
// Test full quote form workflow
test('complete quote submission flow', async ({ page }) => {
  await page.goto('/quote');

  // Fill out form
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.selectOption('select[name="service"]', 'Web Development');
  await page.fill('textarea[name="message"]', 'Need a new website');

  // Submit form
  await page.click('button[type="submit"]');

  // Verify success message
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Performance Optimizations

### Image Handling

```vue
<NuxtImg
  src="/agency_assets/team-photo.jpg"
  alt="Mowry Agency Team"
  width="800"
  height="600"
  sizes="(max-width: 768px) 100vw, 800px"
  format="webp"
  quality="80"
  class="rounded-lg shadow-lg"
/>
```

### Database Optimization

```typescript
// Efficient database queries with proper indexing
const getRecentQuotes = async () => {
  const { data } = await supabase
    .from('quote_requests')
    .select('id, name, email, service, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return data;
};
```

## Email System Architecture

### Template System

```vue
<!-- CustomerConfirmation.vue -->
<template>
  <Html>
    <Head>
      <title>Quote Request Confirmation</title>
    </Head>
    <Body class="bg-zinc-50 font-sans">
      <Container class="mx-auto max-w-2xl">
        <Section class="bg-white p-8 rounded-lg">
          <Heading class="text-2xl font-bold text-zinc-900">
            Thank you for your quote request!
          </Heading>
          <Text class="text-zinc-600">
            Hi {{ name }}, we've received your request for {{ service }}.
          </Text>
          <!-- Professional email content -->
        </Section>
      </Container>
    </Body>
  </Html>
</template>
```

### Email Configuration

```typescript
// Resend configuration for transactional emails
export const sendEmail = async (options: EmailOptions) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: 'Mowry Agency <noreply@mowryagency.com>',
    to: options.to,
    subject: options.subject,
    react: options.template,
  });
};
```

## Security Considerations

### Environment Variables

```env
# Production environment variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your-api-key
NUXT_PUBLIC_SITE_URL=https://mowryagency.com
```

### Input Validation

```typescript
// Server-side validation for quote requests
import { z } from 'zod';

const QuoteRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  service: z.enum(['Web Development', 'SEO', 'Consulting']),
  message: z.string().max(1000).optional(),
});
```

## Code Quality Standards

### TypeScript Usage

```typescript
// Define comprehensive interfaces
interface QuoteFormData {
  name: string;
  email: string;
  service: 'Web Development' | 'SEO' | 'Consulting' | 'E-commerce';
  budget: 'Under $5k' | '$5k-$15k' | '$15k-$50k' | 'Over $50k';
  timeline: 'ASAP' | '1-2 months' | '3-6 months' | 'Flexible';
  message?: string;
}

// Use proper typing for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Component Documentation

```vue
<!--
QuoteForm Component
- Handles multi-step quote request submission
- Integrates with Supabase for data storage
- Sends email notifications via Resend
- Includes form validation and loading states
-->
<template>
  <!-- Component implementation -->
</template>
```

## File Organization

```
spotlight-nuxt/
├── app/
│   ├── components/           # Reusable UI components
│   ├── composables/          # Vue composables
│   ├── layouts/             # Page layouts
│   ├── pages/               # File-based routing
│   ├── assets/css/          # Global styles
│   └── types/               # TypeScript definitions
├── server/
│   └── api/                 # Server API routes
├── emails/                  # Email templates
├── supabase/               # Database configuration
├── agency_assets/          # Agency-specific images
└── public/                 # Static assets
```

Remember: Every change should maintain professional agency standards, optimal performance, and seamless user experience while leveraging Nuxt.js best practices for full-stack development.
├── assets/css/ # Global styles
└── public/images/ # Static assets

```

Remember: Every change should maintain the exact visual fidelity and behavior of the original Spotlight template while leveraging Nuxt.js best practices and performance optimizations.
```
