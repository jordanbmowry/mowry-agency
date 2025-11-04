<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-black py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900 dark:text-white">
            Leads Management
          </h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all leads including their contact information, coverage
            type, and status.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          <button
            type="button"
            @click="handleExportCSV"
            :disabled="exporting || leads.length === 0"
            class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed"
          >
            {{ exporting ? 'Exporting...' : 'Export CSV' }}
          </button>
          <button
            type="button"
            @click="handleSignOut"
            class="block rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
      <LeadsFilters
        :model-value="{
          searchInput: filters.searchInput.value,
          statusFilter: filters.statusFilter.value,
          dateFrom: filters.dateFrom.value,
          dateTo: filters.dateTo.value,
        }"
        :is-filtering="filters.isFiltering.value"
        @update:search-input="
          (val: string) => (filters.searchInput.value = val)
        "
        @update:status-filter="
          (val: string) => (filters.statusFilter.value = val)
        "
        @update:date-from="(val: string) => (filters.dateFrom.value = val)"
        @update:date-to="(val: string) => (filters.dateTo.value = val)"
        @clear="handleClearFilters"
      />
    </div>

    <!-- Leads Table -->
    <LeadsTable
      :leads="leads"
      :is-filtering="filters.isFiltering.value"
      :loading="loading"
    />

    <!-- Loading State -->
    <div
      v-if="loading && leads.length === 0"
      class="mt-8 text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <svg
        class="animate-spin mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="mt-4 text-sm">Loading leads...</p>
    </div>

    <!-- Pagination Controls -->
    <LeadsPagination
      v-if="leads.length > 0"
      :current-page="pagination.currentPage.value"
      :total-count="pagination.totalCount.value"
      :start-index="pagination.startIndex.value"
      :end-index="pagination.endIndex.value"
      :has-next-page="pagination.hasNextPage.value"
      :has-previous-page="pagination.hasPreviousPage.value"
      :page-numbers="pagination.pageNumbers.value"
      @next="pagination.nextPage"
      @previous="pagination.previousPage"
      @go-to-page="pagination.goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import LeadsFilters from '~/components/admin/LeadsFilters.vue';
import LeadsPagination from '~/components/admin/LeadsPagination.vue';
import LeadsTable from '~/components/admin/LeadsTable.vue';
import { useLeadsExport } from '~/composables/useLeadsExport';
import { useLeadsFilters } from '~/composables/useLeadsFilters';
import { usePagination } from '~/composables/usePagination';
import type { Database } from '~/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface LeadsApiResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  message?: string;
}

definePageMeta({
  middleware: ['admin'],
});

const exporting = ref(false);
const { exportLeadsToCSV } = useLeadsExport();

// Initialize pagination composable
const pagination = usePagination({
  initialPage: 1,
  itemsPerPage: 10,
});

// Initialize filters composable
const filters = useLeadsFilters({
  onFilterChange: () => {
    // Reset to first page when filters change
    pagination.goToPage(1);
  },
});

// Create reactive query parameters for the API
const queryParams = computed(() => ({
  page: pagination.currentPage.value,
  limit: pagination.itemsPerPage.value,
  search: filters.filterState.value.searchTerm,
  status: filters.filterState.value.statusFilter,
  dateFrom: filters.filterState.value.dateFrom,
  dateTo: filters.filterState.value.dateTo,
}));

// Create reactive cache key for proper invalidation
const cacheKey = computed(
  () =>
    `leads-${pagination.currentPage.value}-${filters.filterState.value.searchTerm}-${filters.filterState.value.statusFilter}-${filters.filterState.value.dateFrom}-${filters.filterState.value.dateTo}`,
);

// Use Nuxt 4.x useFetch for SSR-safe data fetching
const {
  data: leadsResponse,
  pending: loading,
  error: fetchError,
  refresh: refreshLeads,
} = await useFetch<LeadsApiResponse>('/api/leads', {
  key: cacheKey,
  query: queryParams,
  server: true,
  lazy: true,
});

// Extract leads and pagination info from API response
const leads = computed(() => leadsResponse.value?.data || []);
const apiPagination = computed(() => leadsResponse.value?.pagination);

// Update local pagination when API pagination changes
watch(
  apiPagination,
  (newPagination) => {
    if (newPagination) {
      pagination.setTotalCount(newPagination.total);
    }
  },
  { immediate: true },
);

// Watch pagination changes to refresh data
watch(
  () => pagination.currentPage.value,
  () => {
    // Data will automatically refresh due to reactive query params
  },
  { immediate: false },
);

// Clear filters handler
const handleClearFilters = () => {
  filters.clearFilters();
  pagination.goToPage(1);
};

// Sign out handler
const handleSignOut = async () => {
  try {
    const supabase = useSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigateTo('/admin/login');
  } catch (e) {
    console.error('Sign out error:', e);
    // Error handling - consider using a toast notification
  }
};

// Export to CSV handler
const handleExportCSV = async () => {
  try {
    exporting.value = true;
    await exportLeadsToCSV(leads.value);

    // Refresh the leads to update exported_to_csv status
    await refreshLeads();
  } catch (e) {
    console.error('Export error:', e);
    // Error handling - consider using a toast notification
  } finally {
    exporting.value = false;
  }
};
</script>
