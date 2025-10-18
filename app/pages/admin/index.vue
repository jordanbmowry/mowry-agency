<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-black py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900 dark:text-white">
            Leads Management
          </h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all leads including their contact information, coverage type, and
            status.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          <button
            type="button"
            @click="handleExportCSV"
            :disabled="exporting || quotes.length === 0"
            class="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {{ exporting ? "Exporting..." : "Export CSV" }}
          </button>
          <button
            type="button"
            @click="handleSignOut"
            class="block rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 flow-root overflow-hidden">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <table class="w-full text-left">
          <thead class="bg-white dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                class="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Name
                <div
                  class="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200 dark:border-b-white/15"
                />
                <div
                  class="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200 dark:border-b-white/15"
                />
              </th>
              <th
                scope="col"
                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell dark:text-white"
              >
                Email
              </th>
              <th
                scope="col"
                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-white"
              >
                Phone
              </th>
              <th
                scope="col"
                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell dark:text-white"
              >
                Coverage Type
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Status
              </th>
              <th scope="col" class="py-3.5 pl-3">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quote in quotes" :key="quote.id">
              <td
                class="relative py-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ quote.first_name }} {{ quote.last_name }}
                <div
                  class="absolute right-full bottom-0 h-px w-screen bg-gray-100 dark:bg-white/10"
                />
                <div
                  class="absolute bottom-0 left-0 h-px w-screen bg-gray-100 dark:bg-white/10"
                />
              </td>
              <td
                class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell dark:text-gray-400"
              >
                {{ quote.email }}
              </td>
              <td
                class="hidden px-3 py-4 text-sm text-gray-500 md:table-cell dark:text-gray-400"
              >
                {{ quote.phone || "N/A" }}
              </td>
              <td
                class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell dark:text-gray-400"
              >
                {{ quote.coverage_type || "N/A" }}
              </td>
              <td class="px-3 py-4 text-sm">
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    quote.status === 'new'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400'
                      : quote.status === 'in_progress'
                      ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400'
                      : quote.status === 'contacted'
                      ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400'
                      : quote.status === 'closed'
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400'
                      : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400',
                  ]"
                >
                  {{ quote.status || "new" }}
                </span>
              </td>
              <td class="py-4 pl-3 text-right text-sm font-medium">
                <a
                  :href="`/admin/${quote.id}`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View<span class="sr-only"
                    >, {{ quote.first_name }} {{ quote.last_name }}</span
                  >
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/lib/formatDate";

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
  middleware: ["admin"],
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
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    quotes.value = (data as unknown) as Lead[];
  } catch (e) {
    console.error("Error fetching quotes:", e);
  } finally {
    loading.value = false;
  }
});

// Handle status change
async function handleStatusChange(leadId: string, newStatus: string) {
  try {
    updatingIds.value.push(leadId);

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) throw error;

    // Update local state
    const quote = quotes.value.find((q: Lead) => q.id === leadId);
    if (quote) {
      quote.status = newStatus;
    }
  } catch (e) {
    console.error("Error updating status:", e);
    // Re-fetch to get the actual value from the database
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!error && data) {
      const index = quotes.value.findIndex((q: Lead) => q.id === leadId);
      if (index !== -1) {
        quotes.value[index] = (data as unknown) as Lead;
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
    navigateTo("/admin/login");
  } catch (e) {
    console.error("Error signing out:", e);
  }
}

// Export to CSV handler
async function handleExportCSV() {
  try {
    exporting.value = true;
    await exportLeadsToCSV(quotes.value);
    // Refresh the quotes to update exported_to_csv status
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    quotes.value = (data as unknown) as Lead[];
  } catch (e) {
    console.error("Error exporting to CSV:", e);
  } finally {
    exporting.value = false;
  }
}
</script>
