<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <!-- Search Input -->
    <div class="relative">
      <input
        type="text"
        :value="modelValue.searchInput"
        @input="
          $emit('update:searchInput', ($event.target as HTMLInputElement).value)
        "
        placeholder="Search by name, email, or phone..."
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
      :value="modelValue.statusFilter"
      @change="
        $emit('update:statusFilter', ($event.target as HTMLSelectElement).value)
      "
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
        :value="modelValue.dateFrom"
        :max="modelValue.dateTo"
        @input="
          $emit('update:dateFrom', ($event.target as HTMLInputElement).value)
        "
        class="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
      />
      <input
        type="date"
        :value="modelValue.dateTo"
        :min="modelValue.dateFrom"
        @input="
          $emit('update:dateTo', ($event.target as HTMLInputElement).value)
        "
        class="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
      />
    </div>

    <!-- Clear Filters Button -->
    <button
      @click="$emit('clear')"
      :disabled="!isFiltering"
      class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:text-white dark:border-gray-600 dark:hover:bg-zinc-800"
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
</template>

<script setup lang="ts">
interface LeadsFiltersProps {
  modelValue: {
    searchInput: string;
    statusFilter: string;
    dateFrom: string;
    dateTo: string;
  };
  isFiltering: boolean;
}

defineProps<LeadsFiltersProps>();

defineEmits<{
  'update:searchInput': [value: string];
  'update:statusFilter': [value: string];
  'update:dateFrom': [value: string];
  'update:dateTo': [value: string];
  clear: [];
}>();
</script>
