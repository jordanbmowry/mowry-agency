<template>
  <div
    class="mt-8 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-6 sm:px-6"
  >
    <!-- Mobile Pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <UButton
        variant="outline"
        color="neutral"
        size="lg"
        class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950"
        @click="$emit('previous')"
        :disabled="!hasPreviousPage"
      >
        Previous
      </UButton>
      <UButton
        variant="outline"
        color="neutral"
        size="lg"
        class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950"
        @click="$emit('next')"
        :disabled="!hasNextPage"
      >
        Next
      </UButton>
    </div>

    <!-- Desktop Pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-zinc-700 dark:text-zinc-300">
          Showing
          <span class="font-medium">{{ startIndex }}</span>
          to
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ totalCount }}</span>
          results
        </p>
      </div>
      <nav class="isolate inline-flex gap-1 rounded-md" aria-label="Pagination">
        <UButton
          variant="outline"
          color="neutral"
          size="md"
          class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950"
          @click="$emit('previous')"
          :disabled="!hasPreviousPage"
        >
          <Icon name="heroicons:chevron-left" class="h-5 w-5" />
          <span class="sr-only">Previous</span>
        </UButton>

        <!-- Page numbers -->
        <template v-for="(page, index) in pageNumbers" :key="index">
          <span
            v-if="page === 'ellipsis'"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-950"
          >
            ...
          </span>
          <UButton
            v-else
            :variant="currentPage === page ? 'solid' : 'outline'"
            color="neutral"
            :class="
              currentPage === page
                ? '!bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 dark:!bg-blue-500 dark:!border-blue-500 dark:hover:!bg-blue-600'
                : '!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950'
            "
            @click="$emit('goToPage', page)"
            :aria-current="currentPage === page ? 'page' : undefined"
            size="md"
          >
            {{ page }}
          </UButton>
        </template>

        <UButton
          variant="outline"
          color="neutral"
          size="md"
          class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950"
          @click="$emit('next')"
          :disabled="!hasNextPage"
        >
          <Icon name="heroicons:chevron-right" class="h-5 w-5" />
          <span class="sr-only">Next</span>
        </UButton>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaginationProps {
  currentPage: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumbers: (number | 'ellipsis')[];
}

defineProps<PaginationProps>();

defineEmits<{
  next: [];
  previous: [];
  goToPage: [page: number];
}>();
</script>
