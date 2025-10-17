<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-black">
    <Container class="py-16">
      <div class="flex justify-between items-center mb-8">
        <h1
          class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
        >
          Admin Dashboard
        </h1>
        <div class="flex items-center gap-4">
          <button
            @click="handleExportCSV"
            :disabled="exporting || quotes.length === 0"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 dark:bg-green-700 dark:hover:bg-green-800 dark:disabled:bg-green-600"
          >
            {{ exporting ? 'Exporting...' : 'Export to CSV' }}
          </button>
          <button
            @click="handleSignOut"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div
        class="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-md"
      >
        <ul role="list" class="divide-y divide-zinc-200 dark:divide-zinc-700">
          <li v-for="quote in quotes" :key="quote.id" class="px-6 py-4">
            <div class="flex items-center justify-between gap-6">
              <div class="flex-1">
                <h3
                  class="text-lg font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {{ quote.first_name }} {{ quote.last_name }}
                </h3>
                <div class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <p>Email: {{ quote.email }}</p>
                  <p>Phone: {{ quote.phone }}</p>
                  <p>Coverage Type: {{ quote.coverage_type }}</p>
                  <p>Created: {{ formatDate(quote.created_at) }}</p>
                </div>
                <div class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <p>Message: {{ quote.message }}</p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="flex items-center gap-2">
                  <label
                    for="status-select-"
                    :key="`status-label-${quote.id}`"
                    class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Status:
                  </label>
                  <select
                    :key="`status-${quote.id}`"
                    :value="quote.status"
                    @change="
                      (e) =>
                        handleStatusChange(
                          quote.id,
                          (e.target as HTMLSelectElement).value
                        )
                    "
                    :disabled="updatingIds.includes(quote.id)"
                    class="rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <span
                  v-if="updatingIds.includes(quote.id)"
                  class="text-xs text-zinc-500 dark:text-zinc-400"
                >
                  Updating...
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/lib/formatDate';

interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  coverage_type: string | null;
  health_conditions: string | null;
  current_medications: string | null;
  message: string | null;
  tobacco_use: boolean | null;
  income: number | null;
  occupation: string | null;
  height: string | null;
  weight: string | null;
  loan_amount: number | null;
  status: string | null;
  updated_at?: string | null;
  agent_assigned?: string | null;
}

definePageMeta({
  middleware: ['admin'],
});

const supabase = useSupabaseClient();
const quotes = ref<Lead[]>([]);
const loading = ref(true);
const updatingIds = ref<string[]>([]);
const exporting = ref(false);
const { exportLeadsToCSV } = useLeadsExport();

// Fetch quotes on mount
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    quotes.value = data as unknown as Lead[];
  } catch (e) {
    console.error('Error fetching quotes:', e);
  } finally {
    loading.value = false;
  }
});

// Handle status change
async function handleStatusChange(leadId: string, newStatus: string) {
  try {
    updatingIds.value.push(leadId);

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) throw error;

    // Update local state
    const quote = quotes.value.find((q: Lead) => q.id === leadId);
    if (quote) {
      quote.status = newStatus;
    }
  } catch (e) {
    console.error('Error updating status:', e);
    // Re-fetch to get the actual value from the database
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!error && data) {
      const index = quotes.value.findIndex((q: Lead) => q.id === leadId);
      if (index !== -1) {
        quotes.value[index] = data as unknown as Lead;
      }
    }
  } finally {
    updatingIds.value = updatingIds.value.filter((id) => id !== leadId);
  }
}

// Sign out handler
async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigateTo('/admin/login');
  } catch (e) {
    console.error('Error signing out:', e);
  }
}

// Export to CSV handler
async function handleExportCSV() {
  try {
    exporting.value = true;
    await exportLeadsToCSV(quotes.value);
    // Refresh the quotes to update exported_to_csv status
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    quotes.value = data as unknown as Lead[];
  } catch (e) {
    console.error('Error exporting to CSV:', e);
  } finally {
    exporting.value = false;
  }
}
</script>
