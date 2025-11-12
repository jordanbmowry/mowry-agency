<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <!-- Search Input -->
    <div class="relative">
      <UInput
        type="text"
        :model-value="modelValue.searchInput"
        @update:model-value="
          (value: string) => $emit('update:searchInput', value)
        "
        color="neutral"
        placeholder="Search by name, email, or phone..."
      >
        <template #leading>
          <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
        </template>
      </UInput>
    </div>

    <!-- Status Filter -->
    <USelect
      :model-value="modelValue.statusFilter"
      @update:model-value="
        (value: unknown) => $emit('update:statusFilter', (value as string) || '')
      "
      :options="statusOptions"
      color="neutral"
      placeholder="All Statuses"
    />

    <!-- Date Range Filter -->
    <div class="grid grid-cols-2 gap-2">
      <UDatePicker
        :model-value="modelValue.dateFrom"
        @update:model-value="(value: string) => $emit('update:dateFrom', value)"
        placeholder="From date"
      />
      <UDatePicker
        :model-value="modelValue.dateTo"
        @update:model-value="(value: string) => $emit('update:dateTo', value)"
        placeholder="To date"
      />
    </div>

    <!-- Clear Filters Button -->
    <UButton
      variant="outline"
      color="neutral"
      class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950 justify-center"
      @click="$emit('clear')"
      :disabled="!isFiltering"
    >
      Clear Filters
      <Icon name="heroicons:x-circle" class="ml-2 h-4 w-4" />
    </UButton>
  </div>
</template>

<script setup lang="ts">
import UDatePicker from '~/components/ui/UDatePicker.vue';

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

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
  { value: 'closed', label: 'Closed' },
  { value: 'not_interested', label: 'Not Interested' },
];
</script>
