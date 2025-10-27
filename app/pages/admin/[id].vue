<template>
  <SimpleLayout
    title="Lead Details"
    intro="Detailed information about the lead and their insurance needs."
  >
    <div class="flex items-center justify-end mb-8">
      <NuxtLink
        to="/admin"
        class="group text-sm font-semibold leading-6 text-zinc-800 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
      >
        <span aria-hidden="true">←</span> Back to Leads
      </NuxtLink>
    </div>

    <div v-if="pending" class="mt-16 flex items-center justify-center">
      <p class="text-zinc-600 dark:text-zinc-400">Loading lead details...</p>
    </div>

    <div v-else-if="error" class="mt-16 flex items-center justify-center">
      <p class="text-red-600 dark:text-red-400">
        Error loading lead details. Please try again.
      </p>
    </div>

    <div v-else-if="data" class="mt-8">
      <!-- Mode Toggle Header -->
      <div class="px-4 sm:px-0 flex items-center justify-between">
        <div>
          <h3
            class="text-base/7 font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {{ isEditMode ? 'Edit Lead Information' : 'Lead Information' }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm/6 text-zinc-500 dark:text-zinc-400">
            {{
              isEditMode
                ? 'Update lead details and insurance requirements.'
                : 'Personal details and insurance requirements.'
            }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            v-if="!isEditMode"
            variant="outline"
            size="sm"
            @click="toggleEditMode"
          >
            Edit Lead
          </UButton>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-if="isEditMode" class="mt-6">
        <AdminLeadEditForm
          :lead="data"
          @success="handleEditSuccess"
          @cancel="cancelEdit"
        />
      </div>

      <!-- View Mode -->
      <div v-else class="mt-6">
        <dl
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 border-t border-zinc-200 dark:border-zinc-800"
        >
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Full name
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.first_name }} {{ data.last_name }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Email address
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.email }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Phone number
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatPhone(data.phone) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Date of birth
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatDate(data.date_of_birth) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Location
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.city }}, {{ data.state }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Sex
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatSex(data.sex) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Height
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatHeight(data.height) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Weight
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatWeight(data.weight) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Loan Amount
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatCurrency(data.loan_amount) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Coverage type
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatCoverageType(data.coverage_type) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Health conditions
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatHealthConditions(data.health_conditions) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Current medications
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatMedications(data.medications) }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Message
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.message || 'No message provided' }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Status
            </dt>
            <dd class="mt-1 text-sm sm:mt-2">
              <span
                :class="[
                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                  data.status === 'new'
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400'
                    : data.status === 'in_progress'
                      ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400'
                      : data.status === 'contacted'
                        ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400'
                        : data.status === 'closed'
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400',
                ]"
              >
                {{ formatStatus(data.status) }}
              </span>
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Created at
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ formatDateTime(data.created_at) }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Agent Notes Section -->
      <div class="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div class="px-4 sm:px-0">
          <h3
            class="text-base/7 font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Agent Notes
          </h3>
          <p class="mt-1 max-w-2xl text-sm/6 text-zinc-500 dark:text-zinc-400">
            Internal notes for tracking communications and follow-ups.
          </p>
        </div>
        <div class="mt-6">
          <div class="relative">
            <textarea
              v-model="agentNotes"
              :rows="6"
              placeholder="Add notes about this lead..."
              class="block w-full rounded-md border-0 py-1.5 px-3 text-zinc-900 dark:text-white bg-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-slate-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-500 dark:focus:ring-zinc-400 sm:text-sm sm:leading-6 resize-none"
            />
            <div class="mt-4 flex items-center justify-between">
              <div v-if="saveStatus" class="text-sm">
                <span
                  v-if="saveStatus === 'saving'"
                  class="text-zinc-500 dark:text-zinc-400"
                >
                  Saving...
                </span>
                <span
                  v-else-if="saveStatus === 'saved'"
                  class="text-green-600 dark:text-green-400"
                >
                  ✓ Saved
                </span>
                <span
                  v-else-if="saveStatus === 'error'"
                  class="text-red-600 dark:text-red-400"
                >
                  Error saving notes
                </span>
              </div>
              <div v-else class="text-sm text-transparent">placeholder</div>
              <button
                @click="saveNotes"
                :disabled="isSaving || !notesChanged"
                class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900 cursor-pointer"
              >
                {{ isSaving ? 'Saving...' : 'Save Notes' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone Section -->
      <div class="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div
          class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-6"
        >
          <div class="flex items-center">
            <Icon
              name="heroicons:exclamation-triangle"
              class="h-5 w-5 text-red-600 dark:text-red-400"
            />
            <h3
              class="ml-2 text-base font-semibold text-red-900 dark:text-red-100"
            >
              Danger Zone
            </h3>
          </div>
          <p class="mt-2 text-sm text-red-700 dark:text-red-300">
            Permanently delete this lead and all associated data. This action
            cannot be undone.
          </p>
          <div class="mt-4">
            <UButton
              color="error"
              variant="solid"
              @click="showDeleteModal = true"
              :disabled="isDeleting"
              class="cursor-pointer"
            >
              <Icon name="heroicons:trash" class="h-4 w-4" />
              Delete Lead
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-16 flex items-center justify-center">
      <p class="text-zinc-600 dark:text-zinc-400">No lead found</p>
    </div>
  </SimpleLayout>

  <!-- Delete Confirmation Modal -->
  <UModal
    v-model:open="showDeleteModal"
    :overlay="true"
    :transition="true"
    :dismissible="false"
    title="Delete Lead"
  >
    <template #header>
      <div class="flex items-center">
        <Icon
          name="heroicons:exclamation-triangle"
          class="h-5 w-5 text-red-500"
        />
        <h3 class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
          Delete Lead
        </h3>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          This action cannot be undone. This will permanently delete the lead
          for
          <strong>{{ data?.first_name }} {{ data?.last_name }}</strong>
          and all associated data.
        </p>

        <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            To confirm deletion, please type the lead's email address below:
          </p>
          <p class="text-sm text-red-600 dark:text-red-400 mb-3">
            <code
              class="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded text-xs"
              >{{ data?.email }}</code
            >
          </p>
          <UInput
            v-model="confirmEmailInput"
            placeholder="Enter lead email to confirm deletion"
            :color="confirmEmailInput === data?.email ? 'success' : 'error'"
            class="w-full"
          />
        </div>

        <div
          v-if="deleteError"
          class="rounded-md bg-red-50 dark:bg-red-900/20 p-3"
        >
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ deleteError }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="closeDeleteModal"
          :disabled="isDeleting"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          variant="solid"
          @click="deleteLead"
          :disabled="!canDelete || isDeleting"
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
import type { Database } from '~/types/database.types';
import AdminLeadEditForm from '~/components/admin/AdminLeadEditForm.vue';
import { useErrorHandler } from '~/composables/useErrorHandler';

type Lead = Database['public']['Tables']['leads']['Row'];

definePageMeta({
  middleware: ['admin'],
});

// Import formatters
const {
  formatCoverageType,
  formatStatus,
  formatSex,
  formatHealthConditions,
  formatMedications,
  formatDateTime,
  formatHeight,
  formatWeight,
  formatCurrency,
  formatPhone,
  formatDate,
} = useFormatters();

// Initialize error handler
const { handleAsync, lastError } = useErrorHandler();

const route = useRoute();
const supabase = useSupabaseClient();

// Get lead ID directly from route params
const leadId = route.params.id as string;

// Reactive state
const data = ref<Lead | null>(null);
const pending = ref(true);
const error = ref<string | null>(null);

// Agent notes state
const agentNotes = ref<string>('');
const originalNotes = ref<string>('');
const isSaving = ref(false);
const saveStatus = ref<'saving' | 'saved' | 'error' | null>(null);

// Edit mode state
const isEditMode = ref(false);

// Delete modal state
const showDeleteModal = ref(false);
const confirmEmailInput = ref('');
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);

// Computed property to check if notes have changed
const notesChanged = computed(() => {
  return agentNotes.value !== originalNotes.value;
});

// Computed property to check if deletion can proceed
const canDelete = computed(() => {
  return confirmEmailInput.value === data.value?.email;
});

// Fetch lead data
onMounted(async () => {
  pending.value = true;

  const { data: leadData, error: leadError } = await handleAsync(
    async () => {
      const response = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    { showNotification: true, logToConsole: true },
    { operation: 'fetchLead', leadId }
  );

  if (leadError) {
    error.value = leadError.userMessage;
    pending.value = false;
    return;
  }

  if (leadData) {
    data.value = leadData;
    // Initialize agent notes
    agentNotes.value = leadData.agent_notes || '';
    originalNotes.value = leadData.agent_notes || '';
  }

  pending.value = false;
});

// Save notes function
const saveNotes = async () => {
  if (!notesChanged.value || isSaving.value) return;

  isSaving.value = true;
  saveStatus.value = 'saving';

  const { data: response, error: saveError } = await handleAsync(
    async () => {
      return await $fetch(`/api/leads/${leadId}/notes`, {
        method: 'PATCH',
        body: {
          agent_notes: agentNotes.value,
        },
      });
    },
    { showNotification: true, logToConsole: true },
    { operation: 'saveNotes', leadId, notesLength: agentNotes.value.length }
  );

  isSaving.value = false;

  if (saveError) {
    saveStatus.value = 'error';
    // Clear error message after 5 seconds
    setTimeout(() => {
      if (saveStatus.value === 'error') {
        saveStatus.value = null;
      }
    }, 5000);
    return;
  }

  if (response && response.success) {
    // Update original notes to reflect saved state
    originalNotes.value = agentNotes.value;
    saveStatus.value = 'saved';

    // Clear saved message after 3 seconds
    setTimeout(() => {
      if (saveStatus.value === 'saved') {
        saveStatus.value = null;
      }
    }, 3000);
  }
};

// Edit mode functions
const toggleEditMode = () => {
  isEditMode.value = true;
};

const cancelEdit = () => {
  isEditMode.value = false;
};

const handleEditSuccess = (updatedLead: Lead) => {
  // Update the local data with the updated lead
  data.value = updatedLead;
  // Exit edit mode
  isEditMode.value = false;
};

// Delete modal functions
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  confirmEmailInput.value = '';
  deleteError.value = null;
};

const deleteLead = async () => {
  if (!canDelete.value || isDeleting.value) return;

  isDeleting.value = true;
  deleteError.value = null;

  const { data: response, error: deleteErr } = await handleAsync(
    async () => {
      return await $fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });
    },
    { showNotification: true, logToConsole: true },
    { operation: 'deleteLead', leadId, email: data.value?.email }
  );

  isDeleting.value = false;

  if (deleteErr) {
    deleteError.value = deleteErr.userMessage;
    return;
  }

  if (response && response.success) {
    // Navigate back to admin dashboard after successful deletion
    await navigateTo('/admin');
  }
};
</script>
