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
            :disabled="exporting || leads.length === 0"
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
    <LeadsTable :leads="leads" :is-filtering="filters.isFiltering.value" />

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
import type { Database } from "~/types/database.types";
import LeadsFilters from "~/components/admin/LeadsFilters.vue";
import LeadsTable from "~/components/admin/LeadsTable.vue";
import LeadsPagination from "~/components/admin/LeadsPagination.vue";
import { useLeadsFilters } from "~/composables/useLeadsFilters";
import { usePagination } from "~/composables/usePagination";
import { useLeadsExport } from "~/composables/useLeadsExport";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

definePageMeta({
  middleware: ["admin"],
});

const supabase = useSupabaseClient();
const leads = ref<Lead[]>([]);
const loading = ref(true);
const exporting = ref(false);
const { exportLeadsToCSV } = useLeadsExport();

// Initialize pagination composable
const pagination = usePagination({
  initialPage: 1,
  itemsPerPage: 10,
});

// Fetch leads with pagination and filters
const fetchLeads = async () => {
  try {
    loading.value = true;
    console.log("Fetching leads...");
    console.log("Pagination offset:", pagination.offset.value);
    console.log("Filter state:", filters.filterState.value);

    // Get total count with filters
    let countQuery = supabase.from("leads").select("*", { count: "exact", head: true });
    countQuery = filters.applyToQuery(countQuery);

    const { count, error: countError } = await countQuery;
    if (countError) {
      console.error("Count query error:", countError);
      throw countError;
    }

    console.log("Total count:", count);
    pagination.setTotalCount(count || 0);

    // Get paginated data with filters
    let dataQuery = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    dataQuery = filters.applyToQuery(dataQuery);

    // Apply pagination
    const { data, error } = await dataQuery.range(
      pagination.offset.value,
      pagination.offset.value + pagination.itemsPerPage.value - 1
    );

    if (error) {
      console.error("Data query error:", error);
      throw error;
    }

    console.log("Fetched leads:", data?.length || 0);
    console.log("Leads data:", data);
    leads.value = data || [];
  } catch (e) {
    console.error("Error fetching leads:", e);
  } finally {
    loading.value = false;
  }
};

// Initialize filters composable
const filters = useLeadsFilters({
  onFilterChange: () => {
    console.log("Filter changed, fetching leads...");
    // Reset to first page when filters change
    pagination.goToPage(1);
    fetchLeads();
  },
});

// Watch pagination changes
watch(
  () => pagination.currentPage.value,
  (newPage, oldPage) => {
    console.log(`Page changed from ${oldPage} to ${newPage}`);
    fetchLeads();
  },
  { immediate: false }
);

// Clear filters handler
const handleClearFilters = () => {
  filters.clearFilters();
  pagination.goToPage(1);
};

// Sign out handler
const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigateTo("/admin/login");
  } catch (e) {
    console.error("Error signing out:", e);
  }
};

// Export to CSV handler
const handleExportCSV = async () => {
  try {
    exporting.value = true;
    await exportLeadsToCSV(leads.value);

    // Refresh the leads to update exported_to_csv status
    await fetchLeads();
  } catch (e) {
    console.error("Error exporting to CSV:", e);
  } finally {
    exporting.value = false;
  }
};

// Fetch leads on mount
onMounted(() => {
  console.log("Component mounted, calling fetchLeads...");
  fetchLeads();
});
</script>
