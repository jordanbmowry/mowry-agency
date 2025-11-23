# Cursor Rules - Mowry Agency

## Project Context
Lead management system built with Nuxt 3, Vue 3 Composition API, Supabase, and AI integration. Follows functional programming paradigms with composable-driven architecture.

## Tech Stack
- Framework: Nuxt 4 with Vue 3 Composition API
- Styling: Tailwind CSS v4 with @nuxt/ui
- Database: Supabase (PostgreSQL) - centralized via mowry_leads_database repo
- Authentication: @nuxtjs/supabase with PKCE flow
- AI: Vercel AI SDK v5 (OpenAI gpt-4o-mini, Anthropic claude-3-haiku, Google Gemini gemini-2.0-flash-exp for video generation)
- Validation: Zod for type-safe schemas
- Forms: FormKit with Zod integration
- Type Safety: Full TypeScript with auto-generated Supabase types

## Critical Rules

### Database Management
- NEVER create migrations in this project - use mowry_leads_database repository
- NEVER manually edit `app/types/database.types.ts` - it's auto-generated
- ALWAYS use `useSupabaseClient<Database>()` for type-safe operations
- Use `pnpm run db:types` to sync latest types from centralized database
- Database has exactly 6 tables: leads, profiles, unsubscribes, leads_compliance_report, leads_compliance_report_runs, _owner_required_migrations

### Functional Programming (MANDATORY)
- ALL business logic must be pure functions with no side effects
- ALWAYS create new objects/arrays instead of mutating existing ones
- Use composition over inheritance - compose composables, not classes
- Example: `const updateLead = (lead: Lead, updates: Partial<Lead>): Lead => ({ ...lead, ...updates })`
- NEVER mutate props or external state directly

### Component Architecture
- Single Responsibility: Each component does ONE thing
- Props Down, Events Up: Parent owns state, children emit events
- Use `<script setup lang="ts">` - NO class components
- Structure: Imports → Props/Emits → Composables → State → Computed → Methods → Lifecycle

### Composable Patterns
Create composables for:
- Reusable business logic (validation, calculations)
- Stateful logic shared across components (pagination, filtering)
- Side effects (API calls, database operations)
- Complex computed properties

Don't create composables for:
- Simple one-off functions
- Component-specific UI logic
- Constants or configuration

Composable structure:
1. State (refs/reactive)
2. Computed properties
3. Methods (pure when possible)
4. Side effects (onMounted, etc.)
5. Return public API with readonly state

### Data Fetching
- Use `useAsyncData` or `useLazyFetch` for SSR-optimized data (NOT onMounted)
- Use reactive cache keys: `computed(() => \`leads-\${filters.search}-\${filters.status}\`)`
- Use `useSupabaseClient<Database>()` for complex queries and real-time subscriptions
- Debounce search inputs to prevent excessive API calls
- Always define TypeScript interfaces for API responses

### TypeScript
- Define interfaces for all data structures
- Use generated Database types: `import type { Database } from '~/types/database.types'`
- Type Supabase client: `const supabase = useSupabaseClient<Database>()`
- Define return types for composables
- NEVER use `any` types

### CSS Classes
- ALWAYS use `clsx` for conditional classes - NEVER string concatenation
- Use computed properties for reactive classes
- Example: `const buttonClass = computed(() => clsx('btn', variant === 'primary' && 'btn-primary'))`

### Validation
- ALWAYS use Zod schemas for validation (client AND server)
- Match database constraints exactly in validation schemas
- Use `useZodValidation` composable for client-side validation
- Use `validateWithZod` utility for server-side validation
- NEVER write manual validation functions

### Form Management
- Use FormKit with Zod plugin integration
- Use `createZodPlugin` from `@formkit/zod`
- Leverage FormKit's built-in accessibility features
- Handle loading states with `:disabled` props

### AI Integration
- Use cheapest models: `gpt-4o-mini` and `claude-3-haiku` for development
- Use `gemini-2.0-flash-exp` for video generation (concepts, storyboards, scripts)
- ALWAYS use Zod schemas with `generateObject()` for structured outputs
- Implement provider fallbacks (OpenAI → Anthropic for text, Gemini for video)
- Use service factory pattern: `createGeminiVideoService()` returns mock/real service automatically
- NEVER make real API calls in tests - use comprehensive mocks
- Track usage and costs in service logs
- Video generation endpoints: `/api/ai/video/concept`, `/api/ai/video/storyboard`, `/api/ai/video/script`, `/api/ai/video/generate`

### Error Handling
- Use `useErrorHandler` composable for consistent error handling
- Handle errors at appropriate levels with proper user feedback
- Use `createError` from Nuxt for API route errors
- Always provide user-friendly error messages

### Performance
- Use computed properties for expensive calculations
- Debounce user input (search, filters)
- Use `readonly()` for returned state from composables
- Cache static class combinations in constants

### Code Quality DOs
1. Use pure functions for all business logic
2. Maintain immutability - create new objects/arrays
3. Use composition - build from simple composables
4. Define TypeScript interfaces for all data
5. Single responsibility per component/composable
6. Props down, events up pattern
7. Use computed for expensive calculations
8. Debounce user input
9. Handle errors with proper boundaries
10. Use Nuxt 4.x data fetching patterns
11. Use reactive cache keys
12. Use clsx for conditional classes
13. Type Supabase client with Database interface
14. Use Zod for all validation
15. Use FormKit for forms

### Code Quality DON'Ts
1. NEVER mutate props or external state
2. NO side effects in computed properties
3. NO direct DOM manipulation
4. NO class components - use Composition API
5. NO global state - use composables
6. NO inline styles - use Tailwind
7. NO magic numbers - use constants
8. NO nested ternaries - use computed or helpers
9. NO large components - break them down
10. NO unvalidated input - validate client AND server
11. NO onMounted data fetching - use Nuxt composables
12. NO static cache keys - use reactive keys
13. NO string concatenation for classes - use clsx
14. NO untyped API responses - define interfaces
15. NO manual validation - use Zod schemas

### File Organization
- Components: `app/components/` (ui/, leads/, layout/)
- Composables: `app/composables/`
- Pages: `app/pages/` (file-based routing)
- API Routes: `server/api/`
- Types: `app/types/` (database.types.ts is auto-generated)
- Utils: `app/utils/` (client) and `server/utils/` (server)

### API Route Pattern
```typescript
export default defineEventHandler(async (event) => {
  try {
    // 1. Validate with Zod
    const body = await readBody(event);
    const validationResult = validateWithZod(schema, body);
    if (!validationResult.success) {
      throw createError({ statusCode: 400, ... });
    }

    // 2. Database operation
    const supabase = serverSupabaseServiceRole(event);
    const { data, error } = await supabase.from('table').insert([...]);
    if (error) throw error;

    // 3. Return success
    return { success: true, data };
  } catch (error) {
    throw createError({ statusCode: 500, ... });
  }
});
```

### Vue Component Structure
```vue
<script setup lang="ts">
// 1. Imports (types first)
import type { Lead } from '~/types/leads';

// 2. Props and Emits
interface Props { ... }
const props = withDefaults(defineProps<Props>(), { ... });
const emit = defineEmits<{ ... }>();

// 3. Composables
const { data } = useAsyncData(...);

// 4. Local state
const isEditing = ref(false);

// 5. Computed
const isValid = computed(() => ...);

// 6. Methods
const handleSubmit = async () => { ... };

// 7. Lifecycle
onMounted(() => { ... });
</script>
```

### Testing
- Mock AI services comprehensively to prevent CI/CD costs
- Test pure functions in isolation
- Use Vitest for unit tests
- Use Playwright for E2E tests
- NEVER allow real API calls in test suite

### Git Operations (MANDATORY)
- ALWAYS run `pnpm lint:fix` before staging files with `git add`
- ALWAYS run `pnpm validate` before committing changes
- NEVER commit without running both commands successfully
- If lint:fix or validate fails, fix the errors before committing
- The workflow should be: Make changes → `pnpm lint:fix` → `pnpm validate` → `git add` → `git commit` → `git push`
- This ensures code quality and prevents CI/CD failures

## When in Doubt
- Follow functional programming principles
- Use existing composables as patterns
- Check `.github/copilot-instructions.md` for detailed examples
- Reference `mowry_leads_database` repository for database changes
- Use TypeScript strictly - no `any` types
- Validate everything with Zod
- Use Nuxt UI components for consistency
- Use FormKit for forms
