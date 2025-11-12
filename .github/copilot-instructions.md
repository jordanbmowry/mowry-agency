# GitHub Copilot Instructions - Mowry Agency

## Project Context

This is a **modern digital agency website** built with Nuxt 3, featuring a pixel-perfect migration from the [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI. The project demonstrates advanced Nuxt.js capabilities with server-side rendering, **composable-driven architecture**, **functional programming patterns**, and optimal performance for a professional agency presence.

## Tech Stack & Architecture

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Nuxt UI for consistent, accessible UI components
- **Database**: Centralized management via [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository
- **Database Engine**: Supabase (PostgreSQL) with Row Level Security
- **Email**: Resend API for transactional email notifications
- **UI Library**: Headless UI Vue for accessible components (legacy)
- **Theme System**: Nuxt Color Mode for dark/light theme switching
- **Images**: Nuxt Image for optimized image handling with WebP
- **Animations**: @formkit/auto-animate and @vueuse/motion
- **State Management**: VueUse utilities (@vueuse/core)
- **Testing**: Vitest for unit tests, Playwright for e2e testing
- **Deployment**: Netlify with SSR and custom domain configuration
- **Type Safety**: Full TypeScript coverage with auto-generated Supabase types

## 🗄️ Centralized Database Management

**IMPORTANT**: This project uses a **centralized database management system**. All database operations, migrations, and schema management are handled by the separate [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository.

### Database Commands Available
```bash
# All database operations delegate to mowry_leads_database
pnpm run db:types     # Generate TypeScript types from database
pnpm run db:migrate   # Apply pending migrations
pnpm run db:reset     # Reset database (development only)
pnpm run db:start     # Start local Supabase instance
pnpm run db:stop      # Stop local Supabase instance
pnpm run db:status    # Check database connection status
```

### Database Structure (6 Tables)
The system manages exactly **6 tables**:
1. `leads` - Primary leads management with TCPA compliance
2. `profiles` - User profile management  
3. `unsubscribes` - Email unsubscribe tracking
4. `leads_compliance_report` - TCPA compliance reporting
5. `leads_compliance_report_runs` - Compliance execution history
6. `_owner_required_migrations` - Supabase migration tracking

### Key Benefits
- ✅ **Single source of truth** for database schema
- ✅ **Coordinated migrations** across multiple projects (mowry_agency + mowry-leads)
- ✅ **Automated type generation** and syncing
- ✅ **CI/CD validation** of database changes
- ✅ **Production deployment safety**

**For all database-related development, documentation, and migration management, refer to the [mowry_leads_database repository](https://github.com/jordanbmowry/mowry_leads_database).**

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
```

## Nuxt UI System

### Overview

This project uses **Nuxt UI** as the primary UI component library, providing a consistent, accessible, and customizable design system built on top of Tailwind CSS and Headless UI. All UI components follow the zinc color palette and modern design principles.

### Core UI Components

Nuxt UI provides a comprehensive set of pre-built components that are used throughout the application:

#### **Button Component** (`UButton`)

```vue
<!-- Multiple variants available -->
<UButton variant="solid">Default Button</UButton>
<UButton variant="outline">Outline Button</UButton>
<UButton variant="soft">Soft Button</UButton>
<UButton variant="ghost">Ghost Button</UButton>
<UButton variant="link">Link Button</UButton>

<!-- Different sizes and colors -->
<UButton size="xs" color="primary">Extra Small</UButton>
<UButton size="sm" color="gray">Small</UButton>
<UButton size="md" color="red">Medium</UButton>
<UButton size="lg" color="green">Large</UButton>
<UButton size="xl" color="blue">Extra Large</UButton>
```

#### **Input Components**

```vue
<!-- Basic Input -->
<UInput
  v-model="value"
  placeholder="Enter text..."
  :disabled="false"
  :required="true"
/>

<!-- Textarea -->
<UTextarea
  v-model="message"
  :rows="4"
  :maxlength="500"
  placeholder="Your message..."
/>

<!-- Select -->
<USelect
  v-model="selected"
  :options="[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]"
  placeholder="Choose an option"
/>
```

#### **Form Components**

Enhanced form components that wrap Nuxt UI components with labels, errors, and help text:

```vue
<!-- FormInput - Wraps UInput with label and validation -->
<FormInput
  id="email"
  label="Email Address"
  type="email"
  v-model="form.email"
  :error="errors.email"
  :required="true"
  help-text="We'll send your quote details here"
  @blur="validateField('email')"
/>

<!-- FormSelect - Wraps USelect with label and validation -->
<FormSelect
  id="country"
  label="Country"
  v-model="form.country"
  :options="countryOptions"
  :error="errors.country"
  :required="true"
  @blur="validateField('country')"
/>

<!-- FormTextarea - Wraps UTextarea with label and validation -->
<FormTextarea
  id="message"
  label="Message"
  v-model="form.message"
  :rows="4"
  :maxlength="500"
  :error="errors.message"
  help-text="Tell us more about your needs"
/>
```

### Nuxt UI Configuration

Nuxt UI is configured in `nuxt.config.ts`:

```typescript
modules: [
  '@nuxt/ui',
  // ... other modules
],
```

### Available Components

Nuxt UI provides a comprehensive set of components including:

- **Forms**: UInput, UTextarea, USelect, UCheckbox, URadio, UToggle
- **Navigation**: UButton, ULink, UBreadcrumb, UPagination
- **Feedback**: UAlert, UNotification, UProgress, USpinner
- **Overlay**: UModal, UPopover, UTooltip, UDropdown
- **Data Display**: UTable, UCard, UBadge, UAvatar
- **Layout**: UContainer, UDivider, USeparator

### Design System

#### **Color Palette**

- Primary: Zinc scale (zinc-50 to zinc-950)
- Accent: Teal for focus states and highlights
- Error: Red scale for validation errors
- Success: Green scale for success states

#### **Component Styling Principles**

- ✅ Built on Tailwind CSS with consistent design tokens
- ✅ Support dark mode automatically
- ✅ Maintain consistent spacing and typography
- ✅ Use semantic color tokens (primary, gray, red, green, blue)
- ✅ Follow accessibility best practices
- ✅ Fully customizable via Tailwind configuration

### Component Development Guidelines

#### **Creating New UI Components**

1. Place custom components in `app/components/ui/`
2. Use TypeScript with proper interfaces
3. Support all necessary props (disabled, required, etc.)
4. Implement proper event emitters
5. Support dark mode with Nuxt UI's automatic theming
6. Follow accessibility standards
7. Use Nuxt UI base components when possible

#### **Using Nuxt UI Components**

```vue
<script setup lang="ts">
import { computed } from 'vue';

// Always use TypeScript interfaces
interface Props {
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link';
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'primary'
    | 'gray'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  disabled: false,
  size: 'md',
  color: 'primary',
});

const isDisabled = computed(() => props.disabled);
</script>

<template>
  <div class="space-y-4">
    <UInput v-model="value" :disabled="isDisabled" />
    <UButton
      :variant="props.variant"
      :size="props.size"
      :color="props.color"
      :disabled="isDisabled"
    >
      Submit
    </UButton>
  </div>
</template>
```

### Migration Notes

- **Using**: `@nuxt/ui` module for all UI components
- **Enhanced**: All form components use Nuxt UI base components
- **Maintained**: Original Mowry Agency design system and branding
- **Improved**: Better TypeScript support and consistency across components

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

### Error Handling Composable

#### **useErrorHandler.ts** - Centralized error handling

```typescript
const { handleAsync, handleAsyncWithRetry } = useErrorHandler();

// Basic error handling with auto-categorization
const { data, error } = await handleAsync(
  async () => await $fetch('/api/data'),
  {
    showNotification: true, // Show user-friendly toast
    logToServer: true, // Log critical errors to server
  },
  {
    operation: 'fetchData', // Debugging context
    userId: user.id,
  }
);

// With retry logic (exponential backoff)
const { data, error } = await handleAsyncWithRetry(
  async () => await saveData(),
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryDelayMultiplier: 2,
  }
);
```

**Features**:

- Automatic error categorization (validation, network, database, auth, etc.)
- User-friendly message generation
- Retry logic with exponential backoff
- Server-side logging for critical errors
- Rich context tracking for debugging

See `ERROR_HANDLING_GUIDE.md` for complete documentation.

### Helper Composables

- **useLeadsExport.ts** - CSV export with data transformation
- **useCitiesData.ts** - Location/city data management
- **useFormatters.ts** - Human-friendly formatting for database values (snake_case to Title Case)
- **useJoiValidation.ts** - Server-synchronized Joi validation schemas

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

**IMPORTANT**: This project uses the [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database) repository for all database operations. Do NOT create migrations or modify database schema directly in this project.

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

// Use generated types from centralized database management
import type { Database } from '~/types/database.types';
type Lead = Database['public']['Tables']['leads']['Row'];
```

#### **Database Management Guidelines**

**DO ✅**
- Use the generated TypeScript types from `~/types/database.types.ts`
- Use database commands like `pnpm run db:types` to sync latest types
- Follow the existing database schema and table structure
- Use Supabase client for all database operations
- Leverage Row Level Security policies that are pre-configured

**DON'T ❌**
- Create migrations in this project (use mowry_leads_database instead)
- Modify database schema directly
- Manually edit `database.types.ts` (it's auto-generated)
- Create new tables without coordinating via mowry_leads_database
- Bypass RLS policies or create direct SQL connections

**For Database Changes**
1. **Schema Changes**: Create migrations in [mowry_leads_database](https://github.com/jordanbmowry/mowry_leads_database)
2. **Type Updates**: Run `pnpm run db:types` to sync latest types
3. **Testing**: Use `pnpm run db:status` to verify database connectivity
4. **Local Development**: Use `pnpm run db:start` to start local database`

## Data Fetching Patterns

### **Nuxt 4.x Best Practices**

This project implements **Nuxt 4.x data fetching best practices** using a hybrid approach that combines Nuxt's built-in composables with the Supabase Nuxt module for optimal performance and developer experience.

#### **Core Data Fetching Strategy**

We use **two complementary patterns** based on the use case:

1. **Nuxt Native Patterns** (`useAsyncData`, `useLazyFetch`) - For SSR-optimized, cached data fetching
2. **Supabase Composables** (`useSupabaseClient`) - For complex real-time interactions

#### **When to Use Each Pattern**

**✅ Use Nuxt Native Patterns When:**
- Simple data fetching with standard CRUD operations
- SSR/Hydration is important for SEO and performance
- Automatic caching benefits the user experience
- Loading states need to be managed automatically
- Server-side pre-rendering is required

**✅ Use Supabase Composables When:**
- Complex filtering and pagination logic is required
- Real-time updates with Supabase subscriptions
- File uploads or complex transactions are involved
- Fine-grained control over data fetching is needed
- Immediate user interactions require instant feedback

#### **Nuxt Native Pattern - Single Record Fetching**

```typescript
// pages/admin/[id].vue - SSR-optimized single record fetching
const leadId = route.params.id as string;

// Use Nuxt's useLazyFetch for proper data fetching
const {
  data: leadResponse,
  pending,
  error: fetchError,
  refresh,
} = await useLazyFetch<LeadApiResponse>(`/api/leads/${leadId}`, {
  key: `lead-${leadId}`,
  server: true,
});

// Create a writable ref for lead data
const data = ref<Lead | null>(null);

// Watch for changes in the API response and update local data
watch(
  leadResponse,
  (newResponse) => {
    if (newResponse?.success && newResponse.data) {
      data.value = newResponse.data;
    }
  },
  { immediate: true },
);

// Convert fetchError to string for template
const error = computed(() => {
  if (fetchError.value) {
    return typeof fetchError.value === 'string' ? fetchError.value : 'Failed to load lead';
  }
  return null;
});
```

#### **Nuxt Native Pattern - Dashboard Statistics**

```typescript
// pages/index.vue - SSR-optimized dashboard
interface DashboardApiResponse {
  success: boolean;
  data: DashboardStats;
}

const {
  data: statsResponse,
  error: statsError,
  status: statsStatus,
  refresh: refreshStats
} = await useAsyncData<DashboardApiResponse>('dashboard-stats', async () => {
  const response = await $fetch<DashboardApiResponse>('/api/dashboard/stats');
  return response;
});

// Extract reactive data
const stats = computed(() => statsResponse.value?.data || defaultStats);
const loading = computed(() => statsStatus.value === 'pending');
```

#### **Nuxt Native Pattern - Paginated Data with Filters**

```typescript
// pages/admin/index.vue - Reactive cache keys for filtering
const {
  filters,
  currentPage,
  buildCacheKey,
  buildQueryParams,
} = useLeadManagementNuxt();

const {
  data: apiResponse,
  error,
  status: fetchStatus,
  refresh
} = await useLazyFetch<LeadsApiResponse>('/api/leads', {
  key: buildCacheKey,           // Reactive cache key
  query: buildQueryParams,      // Reactive query params
  server: true,
  lazy: true,
  transform: (data: unknown): LeadsApiResponse => {
    return data as LeadsApiResponse;
  }
});

// Extract reactive data
const leads = computed(() => apiResponse.value?.data || []);
const loading = computed(() => fetchStatus.value === 'pending');
```

#### **Supabase Direct Pattern - Complex Operations**

```typescript
// composables/useLeadManagement.ts - Fine-grained control
export const useLeadManagement = (): UseLeadManagementReturn => {
  const supabase = useSupabaseClient<Database>();

  // Reactive state management
  const leads = ref<Lead[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLeads = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      // Complex query building with filters
      let query = supabase.from('leads').select('*');
      query = applyFiltersToQuery(query, filters);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      // Immutable state update
      leads.value = data || [];
    } catch (err) {
      error.value = handleError(err);
    } finally {
      loading.value = false;
    }
  };

  // Real-time subscriptions
  const setupRealtimeSubscription = () => {
    return supabase
      .channel('leads_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads'
      }, (payload) => {
        handleRealtimeUpdate(payload);
      })
      .subscribe();
  };

  return {
    // Read-only state
    leads: readonly(leads),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    fetchLeads,
    setupRealtimeSubscription,
  };
};
```

#### **Best Practices for Data Fetching**

**✅ DO:**
- Use reactive cache keys for automatic invalidation
- Implement proper TypeScript interfaces for API responses
- Use `useLazyFetch` for non-blocking data fetching
- Debounce search inputs to prevent excessive API calls
- Handle errors centrally with proper user feedback
- Use `transform` option for type-safe data transformation

**❌ DON'T:**
- Use static cache keys that never invalidate
- Fetch data in `onMounted` when Nuxt composables can handle it
- Ignore loading states and error handling
- Make API calls on every keystroke without debouncing
- Use `any` types for API responses

#### **API Response Type Safety**

```typescript
// Define comprehensive API response interfaces
interface LeadApiResponse {
  success: boolean;
  data: Lead;
  message?: string;
}

interface LeadsApiResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface DashboardApiResponse {
  success: boolean;
  data: DashboardStats;
}

// Use these types in data fetching patterns
const { data } = await useLazyFetch<LeadApiResponse>(`/api/leads/${id}`);
```

#### **Error Handling in Data Fetching**

```typescript
// Convert fetch errors to user-friendly format
const error = computed(() => {
  if (fetchError.value) {
    return typeof fetchError.value === 'string' 
      ? fetchError.value 
      : 'Failed to load data';
  }
  return null;
});

// Use error handler composable for consistent error management
const { handleAsync } = useErrorHandler();

const saveData = async () => {
  const { data: response, error: saveError } = await handleAsync(
    async () => {
      const result = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value),
      });
      
      if (!result.ok) throw new Error('Failed to save');
      return await result.json();
    },
    { showNotification: true, logToConsole: true },
    { operation: 'saveData' },
  );
};
```

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
│   │   ├── ui/              # Nuxt UI components (Button, Input, Select, etc.)
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
│   │   ├── useDatabase.ts           # Supabase operations (delegates to mowry_leads_database)
│   │   └── ...                      # Other composables
│   ├── lib/                 # Utility functions
│   │   └── utils.ts                # General utility functions
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
│   │   ├── database.types.ts      # Auto-generated from mowry_leads_database
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
├── supabase/               # Local development configuration only
│   └── config.toml         # (Schema managed in mowry_leads_database)
├── agency_assets/          # Agency-specific images
├── public/                 # Static assets
│   └── images/
├── test/                   # Unit tests
│   ├── components/
│   ├── composables/
│   └── api/
└── tests/                  # E2E tests
    └── e2e/
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
11. **Use Nuxt 4.x Data Fetching**: Leverage `useAsyncData` and `useLazyFetch` for SSR-optimized data
12. **Reactive Cache Keys**: Use computed cache keys for automatic invalidation
13. **Type-Safe API Responses**: Always define proper interfaces for API data
14. **Template Safety**: Use optional chaining (`?.`) for nullable data access

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
11. **No onMounted Data Fetching**: Use Nuxt composables instead of manual `onMounted` calls
12. **No Static Cache Keys**: Avoid cache keys that never invalidate
13. **No Untyped API Responses**: Always define proper interfaces for API data
14. **No Direct Property Access**: Use optional chaining for nullable template data
15. **No `any` Types**: Use proper TypeScript types (`unknown`, `Record<string, unknown>`, or specific interfaces) instead of `any`

### **Data Fetching Best Practices**

```typescript
// ✅ GOOD: Use Nuxt native patterns for simple data fetching
const { data, error, status } = await useAsyncData('leads', () =>
  $fetch('/api/leads')
);

// ✅ GOOD: Reactive cache keys for filtering
const cacheKey = computed(() => `leads-${filters.search}-${filters.status}`);

// ✅ GOOD: Type-safe API operations
interface LeadApiResponse {
  success: boolean;
  data: Lead;
  message?: string;
}

const { data } = await useLazyFetch<LeadApiResponse>(`/api/leads/${id}`);

// ✅ GOOD: Template safety with optional chaining
{{ data?.first_name }} {{ data?.last_name }}

// ❌ BAD: Manual data fetching in onMounted
onMounted(async () => {
  const data = await $fetch('/api/leads'); // Use useAsyncData instead
});

// ❌ BAD: Unsafe template access
{{ data.first_name }} // Use data?.first_name

// ❌ BAD: Untyped API responses
const data = await $fetch('/api/leads'); // Define proper interface
```

Remember: Every change should maintain professional agency standards, optimal performance, and seamless user experience while leveraging Nuxt.js best practices for full-stack development with functional programming paradigms.

├── assets/css/ # Global styles
└── public/images/ # Static assets

```

Remember: Every change should maintain the exact visual fidelity and behavior of the original Spotlight template while leveraging Nuxt.js best practices and performance optimizations.
```
