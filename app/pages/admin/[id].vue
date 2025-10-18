<template>
  <SimpleLayout
    title="Lead Details"
    intro="Detailed information about the lead and their insurance needs."
  >
    <div class="flex items-center justify-end mb-8">
      <NuxtLink
        to="/admin"
        class="group text-sm font-semibold leading-6 text-zinc-800 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <span aria-hidden="true">←</span> Back to Leads
      </NuxtLink>
    </div>

    <div v-if="pending" class="mt-16 flex items-center justify-center">
      <p class="text-zinc-600 dark:text-zinc-400">Loading lead details...</p>
    </div>

    <div v-else-if="error" class="mt-16 flex items-center justify-center">
      <p class="text-red-600 dark:text-red-400">
        Error loading lead details. Please try again.
      </p>
    </div>

    <div v-else-if="data" class="mt-8">
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold text-zinc-900 dark:text-zinc-100">
          Lead Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-zinc-500 dark:text-zinc-400">
          Personal details and insurance requirements.
        </p>
      </div>
      <div class="mt-6">
        <dl
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 border-t border-zinc-200 dark:border-zinc-800"
        >
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Full name
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.first_name }} {{ data.last_name }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Email address
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.email }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Phone number
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.phone || 'N/A' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Date of birth
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.date_of_birth || 'N/A' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Location
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.city }}, {{ data.state }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Coverage type
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.coverage_type || 'N/A' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Health conditions
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.health_conditions || 'None reported' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Current medications
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.medications || 'None reported' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Message
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.message || 'No message provided' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Status
            </dt>
            <dd class="mt-1 text-sm sm:mt-2">
              <span
                :class="[
                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                  data.status === 'new'
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400'
                    : data.status === 'in_progress'
                      ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400'
                      : data.status === 'contacted'
                        ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400'
                        : data.status === 'closed'
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400',
                ]"
              >
                {{ data.status || 'new' }}
              </span>
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Created at
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ new Date(data.created_at).toLocaleString() }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-else class="mt-16 flex items-center justify-center">
      <p class="text-zinc-600 dark:text-zinc-400">No lead found</p>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];

definePageMeta({
  middleware: ['admin'],
});

const route = useRoute();
const supabase = useSupabaseClient();

// Get lead ID directly from route params
const leadId = route.params.id as string;

// Reactive state
const data = ref<Lead | null>(null);
const pending = ref(true);
const error = ref<string | null>(null);

// Fetch lead data
onMounted(async () => {
  try {
    pending.value = true;
    error.value = null;

    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError) {
      console.error('Error loading lead:', leadError);
      error.value = leadError.message;
      return;
    }

    data.value = leadData;
  } catch (err) {
    console.error('Error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load lead';
  } finally {
    pending.value = false;
  }
});
</script>
