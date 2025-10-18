# GitHub Copilot Instructions - Mowry Agency

## Project Context

This is a **modern digital agency website** built with Nuxt 3, featuring a pixel-perfect migration from the [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI. The project demonstrates advanced Nuxt.js capabilities with server-side rendering, **composable-driven architecture**, **functional programming patterns**, and optimal performance for a professional agency presence.

## Tech Stack & Architecture

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom design system
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Email**: Resend API for transactional email notifications
- **UI Library**: Headless UI Vue for accessible components
- **Theme System**: Nuxt Color Mode for dark/light theme switching
- **Images**: Nuxt Image for optimized image handling with WebP
- **Animations**: @formkit/auto-animate and @vueuse/motion
- **State Management**: VueUse utilities (@vueuse/core)
- **Testing**: Vitest for unit tests, Playwright for e2e testing
- **Deployment**: Netlify with SSR and custom domain configuration
- **Type Safety**: Full TypeScript coverage with generated Supabase types

## Key Design Principles

### 1. Functional Programming Paradigm

**CRITICAL**: All new code must follow functional programming principles:

#### **Pure Functions**

```typescript
// ✅ GOOD: Pure function, no side effects
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getFullYear() - birth.getFullYear();
};

// ❌ BAD: Mutates external state
let total = 0;
export const addToTotal = (value: number) => {
  total += value; // Side effect!
};
```

#### **Immutability**

```typescript
// ✅ GOOD: Create new objects
const updateFilters = (filters: FilterState, updates: Partial<FilterState>) => {
  return { ...filters, ...updates };
};

// ❌ BAD: Mutate existing objects
const updateFilters = (filters: FilterState, updates: Partial<FilterState>) => {
  Object.assign(filters, updates); // Mutation!
};
```

#### **Composition Over Inheritance**

```typescript
// ✅ GOOD: Compose multiple composables
export const useQuoteForm = () => {
  const { form, errors } = useFormState();
  const { validate } = useFormValidation();
  const { submit } = useFormSubmission();

  return { form, errors, validate, submit };
};

// ❌ BAD: Class inheritance
class BaseForm {
  validate() {}
}
class QuoteForm extends BaseForm {}
```

### 2. Component Architecture

#### **Single Responsibility Principle**

Each component should have ONE clear purpose:

```vue
<!-- ✅ GOOD: FormInput handles only input rendering and validation -->
<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<!-- ❌ BAD: Component doing too much -->
<template>
  <div>
    <input />
    <!-- Rendering -->
    <button @click="submitToApi">Submit</button>
    <!-- API calls -->
    <Modal v-if="showModal" />
    <!-- Modal management -->
  </div>
</template>
```

#### **Props Down, Events Up**

```vue
<!-- ✅ GOOD: Parent owns state -->
<FormInput
  v-model="form.email"
  :error="errors.email"
  @blur="validateField('email')"
/>

<!-- ❌ BAD: Child mutates parent state directly -->
<FormInput :form="form" @blur="form.email = validate(form.email)" />
```

### 3. Composable Design Patterns

#### **When to Create a Composable**

Create composables for:

- ✅ Reusable business logic (validation, calculations)
- ✅ Stateful logic shared across components (pagination, filtering)
- ✅ Side effects (API calls, localStorage)
- ✅ Complex computed properties

Don't create composables for:

- ❌ Simple one-off functions
- ❌ Component-specific UI logic
- ❌ Constants or configuration

#### **Composable Structure**

```typescript
// ✅ GOOD: Well-structured composable
export const useFeature = () => {
  // 1. State (refs/reactive)
  const data = ref<Data[]>([]);
  const loading = ref(false);

  // 2. Computed properties
  const hasData = computed(() => data.value.length > 0);

  // 3. Methods (pure when possible)
  const fetchData = async () => {
    loading.value = true;
    // ... fetch logic
    loading.value = false;
  };

  // 4. Side effects (if needed)
  onMounted(() => {
    fetchData();
  });

  // 5. Return public API
  return {
    data: readonly(data),
    loading: readonly(loading),
    hasData,
    fetchData,
  };
};
```

## Component Architecture

### Form Component System

Reusable, type-safe form components in `components/form/`:

```vue
<!-- FormInput.vue - Handles text, email, tel, date, number inputs -->
<FormInput
  id="email"
  label="Email Address"
  type="email"
  v-model="form.email"
  :error="errors.email"
  :required="true"
  autocomplete="email"
  help-text="We'll send your quote details here"
  @blur="validateField('email')"
/>

<!-- FormSelect.vue - Dropdown with type-safe options -->
<FormSelect
  id="state"
  label="State"
  v-model="form.state"
  :options="stateOptions"
  :error="errors.state"
  :required="true"
  placeholder="Select a state"
  @blur="validateField('state')"
/>

<!-- FormTextarea.vue - Multi-line with character count -->
<FormTextarea
  id="message"
  label="Additional Information"
  v-model="form.message"
  :rows="4"
  :maxlength="500"
  help-text="Tell us more about your needs"
/>
```

### Multi-Step Form Pattern

Quote form broken into logical step components:

```
components/quote/
├── PersonalInfoStep.vue     # Name, contact, demographics, location
├── HealthInfoStep.vue        # Height, weight, health conditions, medications
├── CoverageInfoStep.vue      # Coverage type, TCPA consent, disclosures
└── SuccessMessage.vue        # Post-submission confirmation with actions
```

**Usage Pattern:**

```vue
<template>
  <div v-if="currentStep === 1">
    <PersonalInfoStep
      :form="form"
      :errors="errors"
      :max-date="maxDate"
      @validate="validateField"
    />
  </div>
  <div v-if="currentStep === 2">
    <HealthInfoStep :form="form" :errors="errors" @validate="validateField" />
  </div>
  <div v-if="currentStep === 3">
    <CoverageInfoStep :form="form" :errors="errors" @validate="validateField" />
  </div>
</template>

<script setup lang="ts">
const { form, errors, currentStep, validateField, nextStep, submitForm } =
  useQuoteForm();
</script>
```

### Admin Dashboard Components

Modular admin interface in `components/admin/`:

```vue
<!-- LeadsFilters.vue - Search and filter controls -->
<LeadsFilters
  v-model:search="filters.searchTerm"
  v-model:status="filters.statusFilter"
  v-model:date-from="filters.dateFrom"
  v-model:date-to="filters.dateTo"
  @clear="clearFilters"
/>

<!-- LeadsTable.vue - Responsive data table -->
<LeadsTable :leads="leads" :loading="loading" :empty-message="emptyMessage" />

<!-- LeadsPagination.vue - Page navigation -->
<LeadsPagination
  :current-page="currentPage"
  :total-pages="totalPages"
  :page-numbers="pageNumbers"
  :has-previous="hasPreviousPage"
  :has-next="hasNextPage"
  @go-to-page="goToPage"
  @previous="previousPage"
  @next="nextPage"
/>
```

## Composables Architecture

### Core Composables

#### **useQuoteForm.ts** - Quote form management

```typescript
const {
  // State
  form, // Reactive form data
  errors, // Validation errors
  currentStep, // Current step (1-3)
  isSubmitting, // Loading state

  // Computed
  isStep1Valid, // Step 1 validation
  isStep2Valid, // Step 2 validation
  isStep3Valid, // Step 3 validation
  isFormValid, // Overall validation

  // Methods
  validateField, // Validate single field
  nextStep, // Proceed to next step
  previousStep, // Go back one step
  submitForm, // Submit quote request
  resetForm, // Clear all data
} = useQuoteForm();
```

#### **useFormValidation.ts** - Pure validation functions

```typescript
import { validators } from '~/composables/useFormValidation';

// Factory pattern for validators
const emailError = validators.email('test@example.com');
const phoneError = validators.phone('555-1234');
const nameError = validators.name('John', 'First name');

// All validators return empty string on success, error message on failure
```

#### **useFormSubmission.ts** - Async submission handler

```typescript
const { submit, isSubmitting, error } = useFormSubmission({
  endpoint: '/api/quote',
  onSuccess: (data) => {
    console.log('Submitted:', data);
  },
  onError: (err) => {
    console.error('Failed:', err);
  },
});

await submit(formData);
```

#### **usePagination.ts** - Reusable pagination

```typescript
const {
  currentPage, // Current page number
  itemsPerPage, // Items per page
  totalPages, // Total page count
  offset, // Database offset
  pageNumbers, // Array of page numbers to display
  hasPreviousPage, // Can go back
  hasNextPage, // Can go forward
  goToPage, // Jump to specific page
  previousPage, // Go back one page
  nextPage, // Go forward one page
} = usePagination({
  totalItems: 100,
  itemsPerPage: 10,
});
```

#### **useLeadsFilters.ts** - Search and filtering

```typescript
const {
  filters, // Reactive filter state
  debouncedSearch, // Debounced search term (300ms)
  applyLeadsFilters, // Pure function to apply filters to query
  clearFilters, // Reset all filters
  getStatusBadgeClass, // Get Tailwind classes for status
  getStatusLabel, // Get human-readable status
} = useLeadsFilters();

// Pure function for query building
const query = supabase.from('leads').select('*');
const filteredQuery = applyLeadsFilters(query, filters);
```

### Helper Composables

- **useDatabase.ts** - Type-safe Supabase operations
- **useApiClient.ts** - HTTP client with error handling
- **useLeadsExport.ts** - CSV export with data transformation
- **useCitiesData.ts** - Location/city data management
- **useEmailTemplates.ts** - Email template rendering

## Development Guidelines

### Vue 3 Patterns

```vue
<script setup lang="ts">
// 1. Imports (types first, then modules)
import type {
  QuoteFormData,
  QuoteFormErrors,
} from '~/composables/useQuoteForm';
import { ref, computed } from 'vue';
import FormInput from '~/components/form/FormInput.vue';

// 2. Props and Emits (with TypeScript interfaces)
interface Props {
  form: QuoteFormData;
  errors: QuoteFormErrors;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'validate', field: keyof QuoteFormErrors): void;
  (e: 'submit'): void;
}>();

// 3. Composables
const { $colorMode } = useNuxtApp();
const route = useRoute();

// 4. Local state
const loading = ref(false);

// 5. Computed properties
const isValid = computed(() => !props.errors.email);

// 6. Methods
const handleSubmit = async () => {
  loading.value = true;
  try {
    emit('submit');
  } finally {
    loading.value = false;
  }
};

// 7. Lifecycle hooks
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <!-- Clean, semantic template -->
</template>
```

### Database Patterns

````typescript
### Database Patterns

```typescript
// Use Supabase composables with type safety
const supabase = useSupabaseClient<Database>();

// Type-safe database operations
const submitQuote = async (data: QuoteRequest) => {
  const { data: result, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
};

// Use generated types from Supabase
import type { Database } from '~/types/database.types';
type Lead = Database['public']['Tables']['leads']['Row'];
````

### API Route Patterns

```typescript
// server/api/quote.post.ts
export default defineEventHandler(async (event) => {
  try {
    // 1. Get and validate body
    const body = await readBody(event);

    // 2. Validate using pure functions
    const errors = validateQuoteRequest(body);
    if (errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: errors,
      });
    }

    // 3. Transform data (pure function)
    const leadData = transformLeadData(body);

    // 4. Database operation
    const supabase = serverSupabaseServiceRole(event);
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;

    // 5. Side effects (email)
    await sendQuoteEmails(config, data, agency);

    // 6. Return success response
    return {
      success: true,
      leadId: data.id,
    };
  } catch (error) {
    // 7. Error handling
    console.error('Quote submission error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process quote',
    });
  }
});
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
    to: config.agencyEmail,
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
      class="rounded-lg bg-zinc-900 px-6 py-3 text-white shadow-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 transition-colors duration-200"
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
-- Leads table with TCPA compliance
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

  -- TCPA Compliance Fields
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);
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

### Composable Testing

```typescript
// Test pure validation functions
describe('useFormValidation', () => {
  test('validates email format', () => {
    const { validators } = useFormValidation();

    expect(validators.email('invalid')).toBe(
      'Please enter a valid email address'
    );
    expect(validators.email('test@example.com')).toBe('');
  });

  test('validates phone number', () => {
    const { validators } = useFormValidation();

    expect(validators.phone('123')).toBe('Please enter a valid phone number');
    expect(validators.phone('555-123-4567')).toBe('');
  });
});
```

### E2E Testing

```typescript
// Test full quote submission flow
test('complete quote submission flow', async ({ page }) => {
  await page.goto('/quote');

  // Fill out multi-step form
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.click('button:has-text("Next")');

  // Health information
  await page.fill('input[name="height"]', '70');
  await page.fill('input[name="weight"]', '180');
  await page.click('button:has-text("Next")');

  // Coverage and consent
  await page.selectOption('select[name="coverageType"]', 'term-life');
  await page.check('input[name="tcpaConsent"]');
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
  loading="lazy"
  class="rounded-lg shadow-lg"
/>
```

### Database Optimization

```typescript
// Efficient database queries with proper indexing
const getRecentLeads = async (limit = 10) => {
  const { data } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return data;
};

// Pagination with offset
const getLeadsPaginated = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;

  const { data, count } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .range(offset, offset + perPage - 1)
    .order('created_at', { ascending: false });

  return { data, total: count, page, perPage };
};
```

### Computed Properties for Performance

```typescript
// Cache expensive calculations
const filteredLeads = computed(() => {
  return leads.value.filter((lead) => {
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      return (
        lead.first_name.toLowerCase().includes(search) ||
        lead.last_name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search)
      );
    }
    return true;
  });
});

// Debounce search input
const searchTerm = ref('');
const debouncedSearch = refDebounced(searchTerm, 300);

watch(debouncedSearch, () => {
  fetchLeads();
});
```

## Email System Architecture

### Template System

```vue
<!-- emails/CustomerConfirmation.vue -->
<template>
  <Html>
    <Head>
      <title>Quote Request Confirmation - Mowry Agency</title>
    </Head>
    <Body class="bg-zinc-50 font-sans">
      <Container class="mx-auto max-w-2xl py-8">
        <Section class="bg-white rounded-lg shadow-lg p-8">
          <Heading class="text-2xl font-bold text-zinc-900 mb-4">
            Thank You for Your Quote Request!
          </Heading>
          <Text class="text-zinc-700 mb-6">
            Hi {{ firstName }}, we've received your request for
            {{ coverageType }} insurance. Our team will review your information
            and contact you within 24-48 hours.
          </Text>
          <!-- Professional email content with agency branding -->
        </Section>
      </Container>
    </Body>
  </Html>
</template>
```

### Email Configuration

```typescript
// server/utils/email.ts
import { Resend } from 'resend';

export const sendEmail = async (options: EmailOptions) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: 'Mowry Agency <noreply@mowryagency.com>',
    to: options.to,
    subject: options.subject,
    react: options.template,
  });
};

// Send dual notifications (customer + agency)
export const sendQuoteEmails = async (
  config: RuntimeConfig,
  leadData: Lead,
  agencyInfo: AgencyInfo
) => {
  // Customer confirmation
  await sendEmail({
    to: leadData.email,
    subject: 'Your Quote Request Confirmation',
    template: CustomerConfirmation({ lead: leadData }),
  });

  // Agency notification
  await sendEmail({
    to: agencyInfo.email,
    subject: `New Quote Request from ${leadData.first_name} ${leadData.last_name}`,
    template: AgencyNotification({ lead: leadData, agency: agencyInfo }),
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

# Agency contact information
AGENCY_EMAIL=admin@mowryagency.com
AGENCY_PHONE=555-123-4567
```

### Input Validation

```typescript
// Server-side validation for quote requests using Zod
import { z } from 'zod';

const QuoteRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format XXX-XXX-XXXX'),
  dateOfBirth: z.string().refine(
    (date) => {
      const age = calculateAge(date);
      return age >= 18 && age <= 85;
    },
    { message: 'Must be between 18 and 85 years old' }
  ),
  sex: z.enum(['male', 'female', 'other']),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2-letter code'),
  height: z.number().min(36).max(96),
  weight: z.number().min(50).max(500),
  healthConditions: z.string().max(500),
  medications: z.string().max(500),
  coverageType: z.enum([
    'term-life',
    'whole-life',
    'universal-life',
    'final-expense',
    'disability',
    'other',
  ]),
  tcpaConsent: z.boolean().refine((val) => val === true, {
    message: 'TCPA consent is required',
  }),
  message: z.string().max(1000).optional(),
});

// Validate in API route
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = QuoteRequestSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.issues,
    });
  }

  // Proceed with validated data
  const validatedData = result.data;
});
```

### TCPA Compliance

```typescript
// Track consent metadata
const captureConsentMetadata = (event: H3Event) => {
  const headers = getHeaders(event);

  return {
    consentTimestamp: new Date().toISOString(),
    consentIpAddress:
      headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
    consentUserAgent: headers['user-agent'] || 'unknown',
    consentText:
      'By checking this box, I consent to receive marketing communications...',
  };
};

// Store in database with lead
const leadData = {
  ...formData,
  ...captureConsentMetadata(event),
  formVersion: '2.0', // Track form version for compliance
};
```

## Code Quality Standards

### TypeScript Usage

```typescript
// Define comprehensive interfaces
interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | 'other';
  city: string;
  state: string;
  height: number;
  weight: number;
  healthConditions: string;
  medications: string;
  coverageType:
    | 'term-life'
    | 'whole-life'
    | 'universal-life'
    | 'final-expense'
    | 'disability'
    | 'other';
  tcpaConsent: boolean;
  emailMarketingConsent: boolean;
  message?: string;
}

interface QuoteFormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: string;
  city: string;
  state: string;
  height: string;
  weight: string;
  healthConditions: string;
  medications: string;
  coverageType: string;
  tcpaConsent: string;
  message: string;
}

// Use proper typing for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Type-safe composable return
interface UseQuoteFormReturn {
  form: Ref<QuoteFormData>;
  errors: Ref<QuoteFormErrors>;
  currentStep: Ref<number>;
  isSubmitting: Ref<boolean>;
  isStep1Valid: ComputedRef<boolean>;
  isStep2Valid: ComputedRef<boolean>;
  isStep3Valid: ComputedRef<boolean>;
  isFormValid: ComputedRef<boolean>;
  validateField: (field: keyof QuoteFormErrors) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}
```

### Component Documentation

```vue
<!--
FormInput Component
- Reusable input field for text, email, tel, date, number types
- Provides validation error display and help text
- Emits update:modelValue for v-model binding
- Emits blur event for validation triggers

Props:
- id: string (required) - Input element ID
- label: string (required) - Input label text
- modelValue: string | number (required) - v-model value
- type: InputType (default: 'text') - HTML input type
- error: string (optional) - Validation error message
- helpText: string (optional) - Assistance text below input
- required: boolean (default: false) - Mark field as required
- disabled: boolean (default: false) - Disable input
- placeholder: string (optional) - Placeholder text
- autocomplete: string (optional) - Autocomplete attribute
- min: string | number (optional) - Min value for date/number
- max: string | number (optional) - Max value for date/number

Usage:
<FormInput
  id="email"
  label="Email Address"
  type="email"
  v-model="form.email"
  :error="errors.email"
  :required="true"
  autocomplete="email"
  help-text="We'll send your quote details here"
  @blur="validateField('email')"
/>
-->
<script setup lang="ts">
// Component implementation
</script>
```

## File Organization

```
spotlight-nuxt/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── form/            # Form components (FormInput, FormSelect, FormTextarea)
│   │   ├── quote/           # Quote form step components
│   │   ├── admin/           # Admin dashboard components
│   │   └── ...              # Other shared components
│   ├── composables/          # Vue composables
│   │   ├── useQuoteForm.ts          # Quote form management
│   │   ├── useFormValidation.ts     # Pure validation functions
│   │   ├── useFormSubmission.ts     # Form submission handler
│   │   ├── usePagination.ts         # Pagination logic
│   │   ├── useLeadsFilters.ts       # Admin filters
│   │   ├── useLeadsExport.ts        # CSV export
│   │   ├── useDatabase.ts           # Supabase operations
│   │   └── ...                      # Other composables
│   ├── layouts/             # Page layouts (default.vue)
│   ├── pages/               # File-based routing
│   │   ├── index.vue               # Home page
│   │   ├── quote.vue               # Quote form page
│   │   ├── admin/
│   │   │   ├── index.vue          # Admin dashboard
│   │   │   └── [id].vue           # Lead detail page
│   │   └── ...                     # Other pages
│   ├── assets/css/          # Global styles
│   ├── types/               # TypeScript definitions
│   │   ├── database.types.ts      # Supabase generated types
│   │   └── validation.ts          # Validation types
│   └── utils/               # Utility functions
├── server/
│   ├── api/                 # Server API routes
│   │   ├── quote.post.ts          # Quote submission endpoint
│   │   ├── leads/
│   │   │   ├── index.get.ts      # List leads
│   │   │   ├── [id].get.ts       # Get single lead
│   │   │   └── export.get.ts     # Export CSV
│   │   └── ...
│   └── utils/               # Server utilities
│       ├── email.ts               # Email sending functions
│       └── validation.ts          # Server-side validation
├── emails/                  # Email templates (Vue Email)
│   ├── CustomerConfirmation.vue
│   ├── AgencyNotification.vue
│   └── tailwind.config.ts
├── supabase/               # Database configuration
│   ├── config.toml
│   └── migrations/          # SQL migrations
├── agency_assets/          # Agency-specific images
├── public/                 # Static assets
│   └── images/
├── test/                   # Unit tests
│   ├── components/
│   ├── composables/
│   └── api/
└── tests/                  # E2E tests
    └── e2e/
```

## Admin Dashboard

### Composables for Admin

```typescript
// app/composables/useLeadsFilters.ts
export const useLeadsFilters = () => {
  const filters = reactive<LeadsFilters>({
    searchTerm: '',
    statusFilter: 'all',
    dateFrom: null,
    dateTo: null,
  });

  // Debounced search (300ms delay)
  const debouncedSearch = refDebounced(toRef(filters, 'searchTerm'), 300);

  // Pure function to apply filters to query
  const applyLeadsFilters = (
    query: SupabaseQueryBuilder,
    filters: LeadsFilters
  ) => {
    let filteredQuery = query;

    if (filters.searchTerm) {
      filteredQuery = filteredQuery.or(
        `first_name.ilike.%${filters.searchTerm}%,` +
          `last_name.ilike.%${filters.searchTerm}%,` +
          `email.ilike.%${filters.searchTerm}%`
      );
    }

    if (filters.statusFilter !== 'all') {
      filteredQuery = filteredQuery.eq('status', filters.statusFilter);
    }

    if (filters.dateFrom) {
      filteredQuery = filteredQuery.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      filteredQuery = filteredQuery.lte('created_at', filters.dateTo);
    }

    return filteredQuery;
  };

  const clearFilters = () => {
    filters.searchTerm = '';
    filters.statusFilter = 'all';
    filters.dateFrom = null;
    filters.dateTo = null;
  };

  return {
    filters,
    debouncedSearch,
    applyLeadsFilters,
    clearFilters,
  };
};
```

### Admin Components

```vue
<!-- app/components/admin/LeadsTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
      <thead class="bg-zinc-50 dark:bg-zinc-800">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Coverage Type</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in leads" :key="lead.id">
          <td>{{ lead.first_name }} {{ lead.last_name }}</td>
          <td>{{ lead.email }}</td>
          <td>{{ lead.phone }}</td>
          <td>{{ formatCoverageType(lead.coverage_type) }}</td>
          <td>
            <span :class="getStatusBadgeClass(lead.status)">
              {{ getStatusLabel(lead.status) }}
            </span>
          </td>
          <td>{{ formatDate(lead.created_at) }}</td>
          <td>
            <NuxtLink
              :to="`/admin/${lead.id}`"
              class="text-blue-600 hover:text-blue-800"
            >
              View Details
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

## Best Practices Summary

### DO ✅

1. **Use Pure Functions**: All validators and transformers should be pure
2. **Immutability**: Always create new objects/arrays instead of mutating
3. **Composition**: Build complex behavior from simple composables
4. **Type Safety**: Define interfaces for all data structures
5. **Single Responsibility**: Each component/composable does ONE thing well
6. **Props Down, Events Up**: Parent controls state, children emit events
7. **Computed Properties**: Cache expensive calculations
8. **Debounce User Input**: Prevent excessive API calls
9. **Error Boundaries**: Handle errors at appropriate levels
10. **TCPA Compliance**: Track all consent metadata

### DON'T ❌

1. **No Mutations**: Don't mutate props or external state
2. **No Side Effects in Computed**: Keep computed properties pure
3. **No Direct DOM Manipulation**: Use Vue's reactive system
4. **No Class Components**: Use Composition API with `<script setup>`
5. **No Global State**: Use composables or provide/inject
6. **No Inline Styles**: Use Tailwind utility classes
7. **No Magic Numbers**: Define constants with descriptive names
8. **No Nested Ternaries**: Use computed properties or helper functions
9. **No Large Components**: Break into smaller, focused components
10. **No Unvalidated Input**: Always validate on client AND server

Remember: Every change should maintain professional agency standards, optimal performance, and seamless user experience while leveraging Nuxt.js best practices for full-stack development with functional programming paradigms.

├── assets/css/ # Global styles
└── public/images/ # Static assets

```

Remember: Every change should maintain the exact visual fidelity and behavior of the original Spotlight template while leveraging Nuxt.js best practices and performance optimizations.
```
