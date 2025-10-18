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

    <!-- Search and Filters -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            v-model="searchInput"
            placeholder="Search by name, email, or phone... (search begins 300ms after you stop typing)"
            class="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-500 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              class="h-5 w-5 text-gray-400 dark:text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>

        <!-- Date Range Filter -->
        <div class="grid grid-cols-2 gap-2">
          <input
            type="date"
            v-model="dateFrom"
            :max="dateTo"
            class="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
          <input
            type="date"
            v-model="dateTo"
            :min="dateFrom"
            class="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>

        <!-- Clear Filters -->
        <button
          @click="clearFilters"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-zinc-900 dark:text-white dark:border-gray-600 dark:hover:bg-zinc-800"
        >
          Clear Filters
          <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
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

    <!-- Pagination Controls -->
    <div
      class="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-6 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="currentPage--"
          :disabled="!hasPreviousPage"
          class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="!hasNextPage"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ offset + 1 }}</span>
            to
            <span class="font-medium">{{
              Math.min(offset + itemsPerPage, totalCount)
            }}</span>
            of
            <span class="font-medium">{{ totalCount }}</span>
            results
          </p>
        </div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            @click="currentPage--"
            :disabled="!hasPreviousPage"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Previous</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <!-- Page numbers -->
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :aria-current="currentPage === page ? 'page' : undefined"
            :class="[
              currentPage === page
                ? 'relative z-10 inline-flex items-center bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="!hasNextPage"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Next</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/lib/formatDate";
import { refDebounced } from "@vueuse/core";

import type { Database } from "~/types/database.types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

definePageMeta({
  middleware: ["admin"],
});

const supabase = useSupabaseClient();
const quotes = ref<Database["public"]["Tables"]["leads"]["Row"][]>([]);
const loading = ref(true);
const updatingIds = ref<string[]>([]);
const exporting = ref(false);
const { exportLeadsToCSV } = useLeadsExport();

// Search and filter state
const searchInput = ref(""); // Raw search input
const searchTerm = refDebounced(searchInput, 300); // Debounced search term
const statusFilter = ref("");
const dateFrom = ref("");
const dateTo = ref("");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;
const totalCount = ref(0);

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage));
const offset = computed(() => (currentPage.value - 1) * itemsPerPage);
const hasNextPage = computed(() => currentPage.value < totalPages.value);
const hasPreviousPage = computed(() => currentPage.value > 1);

// Watch the debounced search term
watch(searchTerm, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  } else {
    fetchLeads();
  }
});

// Function to create query with filters
const createFilteredQuery = (query: any) => {
  // Apply text search filter
  if (searchTerm.value) {
    const searchValue = `%${searchTerm.value}%`;
    query = query.or(
      `first_name.ilike.${searchValue},last_name.ilike.${searchValue},email.ilike.${searchValue},phone.ilike.${searchValue}`
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    query = query.eq("status", statusFilter.value);
  }

  // Apply date range filter
  if (dateFrom.value) {
    query = query.gte("created_at", `${dateFrom.value}T00:00:00`);
  }
  if (dateTo.value) {
    query = query.lte("created_at", `${dateTo.value}T23:59:59`);
  }

  return query;
};

// Fetch leads with pagination and filters
const fetchLeads = async () => {
  try {
    loading.value = true;

    // Get total count with filters
    let countQuery = supabase.from("leads").select("*", { count: "exact", head: true });

    countQuery = createFilteredQuery(countQuery);
    const { count, error: countError } = await countQuery;

    if (countError) throw countError;
    totalCount.value = count || 0;

    // Reset to first page if no results on current page
    if (totalCount.value > 0 && offset.value >= totalCount.value) {
      currentPage.value = 1;
      return fetchLeads();
    }

    // Get paginated data with filters
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    query = createFilteredQuery(query);

    // Apply pagination
    const { data, error } = await query.range(
      offset.value,
      offset.value + itemsPerPage - 1
    );

    if (error) throw error;
    quotes.value = data || [];
  } catch (e) {
    console.error("Error fetching leads:", e);
  } finally {
    loading.value = false;
  }
};

// Function to clear all filters
const clearFilters = () => {
  searchInput.value = "";
  statusFilter.value = "";
  dateFrom.value = "";
  dateTo.value = "";
  currentPage.value = 1;
  fetchLeads();
};

// Fetch quotes on mount
onMounted(() => {
  fetchLeads();
});

// Watch for changes in filters and pagination (except search which is handled by debouncedWatch)
watch([statusFilter, dateFrom, dateTo, currentPage], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1; // Reset to first page when filters change
  } else {
    fetchLeads();
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
    quotes.value = data || [];
  } catch (e) {
    console.error("Error exporting to CSV:", e);
  } finally {
    exporting.value = false;
  }
}
</script>
