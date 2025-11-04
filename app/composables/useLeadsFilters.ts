/**
 * Leads Filters Composable
 * Provides reusable filtering logic for leads management
 * Using functional programming principles
 */

import { refDebounced } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

export interface LeadsFilterState {
  searchTerm: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
}

export interface LeadsFilterOptions {
  debounceMs?: number;
  onFilterChange?: () => void | Promise<void>;
}

/**
 * Pure function to check if any filters are active
 */
const hasActiveFilters = (state: LeadsFilterState): boolean => {
  return !!(state.searchTerm || state.statusFilter || state.dateFrom || state.dateTo);
};

/**
 * Pure function to create Supabase query with filters
 */
export const applyLeadsFilters = (query: any, filters: LeadsFilterState) => {
  let filteredQuery = query;

  // Apply text search filter
  if (filters.searchTerm) {
    const searchValue = `%${filters.searchTerm}%`;
    filteredQuery = filteredQuery.or(
      `first_name.ilike.${searchValue},last_name.ilike.${searchValue},email.ilike.${searchValue},phone.ilike.${searchValue}`,
    );
  }

  // Apply status filter
  if (filters.statusFilter) {
    filteredQuery = filteredQuery.eq('status', filters.statusFilter);
  }

  // Apply date range filter
  if (filters.dateFrom) {
    filteredQuery = filteredQuery.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    filteredQuery = filteredQuery.lte('created_at', `${filters.dateTo}T23:59:59`);
  }

  return filteredQuery;
};

/**
 * Composable for leads filtering
 */
export const useLeadsFilters = (options: LeadsFilterOptions = {}) => {
  const { debounceMs = 300, onFilterChange } = options;

  // Raw filter state
  const searchInput = ref('');
  const statusFilter = ref('');
  const dateFrom = ref('');
  const dateTo = ref('');

  // Debounced search term
  const searchTerm = refDebounced(searchInput, debounceMs);

  // Computed filter state
  const filterState = computed<LeadsFilterState>(() => ({
    searchTerm: searchTerm.value,
    statusFilter: statusFilter.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  }));

  // Check if filters are active
  const isFiltering = computed(() => hasActiveFilters(filterState.value));

  // Count active filters
  const activeFilterCount = computed(() => {
    let count = 0;
    if (filterState.value.searchTerm) count++;
    if (filterState.value.statusFilter) count++;
    if (filterState.value.dateFrom) count++;
    if (filterState.value.dateTo) count++;
    return count;
  });

  // Clear all filters (pure function approach)
  const clearFilters = () => {
    searchInput.value = '';
    statusFilter.value = '';
    dateFrom.value = '';
    dateTo.value = '';
  };

  // Clear individual filter
  const clearFilter = (filterName: keyof LeadsFilterState) => {
    switch (filterName) {
      case 'searchTerm':
        searchInput.value = '';
        break;
      case 'statusFilter':
        statusFilter.value = '';
        break;
      case 'dateFrom':
        dateFrom.value = '';
        break;
      case 'dateTo':
        dateTo.value = '';
        break;
    }
  };

  // Watch for filter changes
  if (onFilterChange) {
    watch(
      [searchTerm, statusFilter, dateFrom, dateTo],
      () => {
        onFilterChange();
      },
      { deep: true },
    );
  }

  // Get URL query params from filters
  const getQueryParams = computed(() => {
    const params: Record<string, string> = {};

    if (filterState.value.searchTerm) {
      params.search = filterState.value.searchTerm;
    }
    if (filterState.value.statusFilter) {
      params.status = filterState.value.statusFilter;
    }
    if (filterState.value.dateFrom) {
      params.from = filterState.value.dateFrom;
    }
    if (filterState.value.dateTo) {
      params.to = filterState.value.dateTo;
    }

    return params;
  });

  // Set filters from URL query params
  const setFromQueryParams = (params: Record<string, string>) => {
    if (params.search) searchInput.value = params.search;
    if (params.status) statusFilter.value = params.status;
    if (params.from) dateFrom.value = params.from;
    if (params.to) dateTo.value = params.to;
  };

  return {
    // Raw inputs (for v-model binding)
    searchInput,
    statusFilter,
    dateFrom,
    dateTo,

    // Computed state
    filterState,
    isFiltering,
    activeFilterCount,
    queryParams: getQueryParams,

    // Methods
    clearFilters,
    clearFilter,
    setFromQueryParams,
    applyToQuery: (query: any) => applyLeadsFilters(query, filterState.value),
  };
};

/**
 * Available status options for filtering
 */
export const LEAD_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
] as const);

/**
 * Pure function to get status label from value
 */
export const getStatusLabel = (status: string): string => {
  const option = LEAD_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.label ?? status;
};

/**
 * Pure function to get status badge classes
 */
export const getStatusBadgeClasses = (status: string): string => {
  const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium';

  const statusClasses: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400',
    in_progress:
      'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400',
    contacted:
      'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400',
    closed:
      'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400',
  };

  return `${baseClasses} ${statusClasses[status] ?? 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400'}`;
};
