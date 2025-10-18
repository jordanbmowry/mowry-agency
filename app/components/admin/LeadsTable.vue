<template>
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
          <tr v-for="lead in leads" :key="lead.id">
            <td
              class="relative py-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ lead.first_name }} {{ lead.last_name }}
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
              {{ lead.email }}
            </td>
            <td
              class="hidden px-3 py-4 text-sm text-gray-500 md:table-cell dark:text-gray-400"
            >
              {{ lead.phone || 'N/A' }}
            </td>
            <td
              class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell dark:text-gray-400"
            >
              {{ lead.coverage_type || 'N/A' }}
            </td>
            <td class="px-3 py-4 text-sm">
              <span :class="getStatusClasses(lead.status)">
                {{ lead.status || 'new' }}
              </span>
            </td>
            <td class="py-4 pl-3 text-right text-sm font-medium">
              <a
                :href="`/admin/${lead.id}`"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View<span class="sr-only"
                  >, {{ lead.first_name }} {{ lead.last_name }}</span
                >
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="leads.length === 0"
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No leads found
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{
            isFiltering
              ? 'Try adjusting your filters'
              : 'Get started by adding a new lead'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.types';
import { getStatusBadgeClasses } from '~/composables/useLeadsFilters';

type Lead = Database['public']['Tables']['leads']['Row'];

interface LeadsTableProps {
  leads: Lead[];
  isFiltering?: boolean;
}

defineProps<LeadsTableProps>();

const getStatusClasses = (status: string | null) => {
  return getStatusBadgeClasses(status || 'new');
};
</script>
