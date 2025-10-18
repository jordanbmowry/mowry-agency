/**
 * Pagination Composable
 * Provides reusable pagination logic using functional programming principles
 */

import { ref, computed, type Ref } from 'vue';

export interface PaginationConfig {
  initialPage?: number;
  itemsPerPage?: number;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  totalPages: number;
  offset: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Composable for pagination
 */
export const usePagination = (config: PaginationConfig = {}) => {
  const currentPage = ref(config.initialPage ?? 1);
  const itemsPerPage = ref(config.itemsPerPage ?? 10);
  const totalCount = ref(0);

  // Pure computed values
  const totalPages = computed(() =>
    Math.ceil(totalCount.value / itemsPerPage.value)
  );

  const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);

  const hasNextPage = computed(() => currentPage.value < totalPages.value);

  const hasPreviousPage = computed(() => currentPage.value > 1);

  const startIndex = computed(() =>
    totalCount.value === 0 ? 0 : offset.value + 1
  );

  const endIndex = computed(() =>
    Math.min(offset.value + itemsPerPage.value, totalCount.value)
  );

  // State object
  const state = computed<PaginationState>(() => ({
    currentPage: currentPage.value,
    itemsPerPage: itemsPerPage.value,
    totalCount: totalCount.value,
    totalPages: totalPages.value,
    offset: offset.value,
    hasNextPage: hasNextPage.value,
    hasPreviousPage: hasPreviousPage.value,
    startIndex: startIndex.value,
    endIndex: endIndex.value,
  }));

  // Navigation functions (pure in nature)
  const goToPage = (page: number): boolean => {
    if (page < 1 || page > totalPages.value) {
      return false;
    }
    currentPage.value = page;
    return true;
  };

  const nextPage = (): boolean => {
    if (!hasNextPage.value) return false;
    currentPage.value++;
    return true;
  };

  const previousPage = (): boolean => {
    if (!hasPreviousPage.value) return false;
    currentPage.value--;
    return true;
  };

  const firstPage = () => {
    currentPage.value = 1;
  };

  const lastPage = () => {
    if (totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  };

  const setTotalCount = (count: number) => {
    totalCount.value = count;

    // If current page is out of bounds, reset to valid page
    if (count > 0 && offset.value >= count) {
      currentPage.value = totalPages.value;
    }
  };

  const setItemsPerPage = (count: number) => {
    itemsPerPage.value = count;
    // Reset to first page when changing items per page
    currentPage.value = 1;
  };

  const reset = () => {
    currentPage.value = config.initialPage ?? 1;
    totalCount.value = 0;
  };

  // Get page numbers for pagination UI (max 7 pages shown)
  const getPageNumbers = computed(() => {
    const pages: (number | 'ellipsis')[] = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(total);
    }

    return pages;
  });

  return {
    // State
    state,
    currentPage: computed(() => currentPage.value),
    itemsPerPage: computed(() => itemsPerPage.value),
    totalCount: computed(() => totalCount.value),
    totalPages,
    offset,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    pageNumbers: getPageNumbers,

    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setTotalCount,
    setItemsPerPage,
    reset,
  };
};
