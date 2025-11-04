<template>
  <UModal
    v-model:open="isOpen"
    title="Delete Lead"
    description="This action cannot be undone. This will permanently delete the lead and all associated data."
    :overlay="true"
    :transition="true"
    :dismissible="false"
    :close="false"
  >

    <template #body>
      <div class="space-y-4">
        <div class="flex items-center mb-4">
          <Icon
            name="heroicons:exclamation-triangle"
            class="h-5 w-5 text-red-500 mr-2"
          />
          <span class="text-sm text-zinc-600 dark:text-zinc-400">
            You are about to delete the lead for
            <strong v-if="lead">{{ lead.first_name }} {{ lead.last_name }}</strong>
          </span>
        </div>

        <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">`
          <p class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            To confirm deletion, please type the lead's email address below:
          </p>
          <p class="text-sm text-red-600 dark:text-red-400 mb-3">
            <code
              class="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded text-xs"
            >{{ leadEmail }}</code>
          </p>
          <UInput
            v-model="confirmEmailInput"
            placeholder="Enter lead email to confirm deletion"
            :color="isEmailConfirmed ? 'success' : 'error'"
            class="w-full"
          />
        </div>

        <div
          v-if="error"
          class="rounded-md bg-red-50 dark:bg-red-900/20 p-3"
        >
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ error }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="handleCancel"
          :disabled="isDeleting"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          variant="solid"
          @click="handleConfirm"
          :disabled="!isEmailConfirmed || isDeleting"
          :loading="isDeleting"
          class="cursor-pointer"
        >
          <Icon v-if="!isDeleting" name="heroicons:trash" class="h-4 w-4" />
          {{ isDeleting ? 'Deleting...' : 'Delete Lead' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
/**
 * DeleteLeadModal Component
 *
 * A reusable modal for confirming lead deletion with email verification.
 * Requires users to type the lead's email address to confirm deletion for safety.
 *
 * @component
 * @example
 * <DeleteLeadModal
 *   v-model:open="showDeleteModal"
 *   :lead="leadData"
 *   :is-deleting="isDeleting"
 *   :error="deleteError"
 *   @confirm="handleDeleteConfirm"
 *   @cancel="handleDeleteCancel"
 * />
 */

import type { Database } from '~/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];

// Props
interface Props {
  /** Controls modal visibility via v-model */
  open: boolean;
  /** Lead data to display */
  lead: Lead | null;
  /** Loading state for delete operation */
  isDeleting?: boolean;
  /** Error message to display */
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false,
  error: null,
});

// Emits
const emit = defineEmits<{
  /** Emitted when modal should close */
  (e: 'update:open', value: boolean): void;
  /** Emitted when deletion is confirmed */
  (e: 'confirm'): void;
  /** Emitted when deletion is cancelled */
  (e: 'cancel'): void;
}>();

// Local state
const confirmEmailInput = ref('');
const isOpen = ref(false);

// Computed properties
const isEmailConfirmed = computed(() => {
  return confirmEmailInput.value === props.lead?.email;
});

const leadEmail = computed(() => props.lead?.email || '');

// Watch the open prop and sync with local state
watch(
  () => props.open,
  (newValue) => {
    console.log('🔍 DeleteLeadModal open prop changed:', newValue);
    isOpen.value = newValue;
  },
  { immediate: true },
);

// Reset confirmation input when modal closes
watch(isOpen, (newValue) => {
  console.log('🔍 DeleteLeadModal isOpen changed:', newValue);
  if (!newValue) {
    confirmEmailInput.value = '';
  }
  if (newValue !== props.open) {
    emit('update:open', newValue);
  }
});

// Methods
const handleConfirm = () => {
  if (!isEmailConfirmed.value || props.isDeleting) return;
  emit('confirm');
};

const handleCancel = () => {
  isOpen.value = false;
  emit('cancel');
};
</script>