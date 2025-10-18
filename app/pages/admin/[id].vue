<template>
  <SimpleLayout
    title="Lead Details"
    intro="Detailed information about the lead and their insurance needs."
  >
    <div class="flex items-center justify-end mb-8">
      <NuxtLink
        to="/admin"
        class="group text-sm font-semibold leading-6 text-zinc-800 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-zinc-300"
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
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold text-zinc-900 dark:text-zinc-100">
          Lead Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-zinc-500 dark:text-zinc-400">
          Personal details and insurance requirements.
        </p>
      </div>
      <div class="mt-6">
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
              {{ data.phone || "N/A" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Date of birth
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.date_of_birth || "N/A" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Location</dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.city }}, {{ data.state }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Coverage type
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.coverage_type || "N/A" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Health conditions
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.health_conditions || "None reported" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Current medications
            </dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.medications || "None reported" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-2 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Message</dt>
            <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-400 sm:mt-2">
              {{ data.message || "No message provided" }}
            </dd>
          </div>
          <div
            class="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:col-span-1 sm:px-0"
          >
            <dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Status</dt>
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
                {{ data.status || "new" }}
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
              {{ new Date(data.created_at).toLocaleString() }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Agent Notes Section -->
      <div class="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div class="px-4 sm:px-0">
          <h3 class="text-base/7 font-semibold text-zinc-900 dark:text-zinc-100">
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
              rows="6"
              placeholder="Add notes about this lead..."
              class="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
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
                class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
              >
                {{ isSaving ? "Saving..." : "Save Notes" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-16 flex items-center justify-center">
      <p class="text-zinc-600 dark:text-zinc-400">No lead found</p>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
import type { Database } from "~/types/database.types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

definePageMeta({
  middleware: ["admin"],
});

const route = useRoute();
const supabase = useSupabaseClient();

// Get lead ID directly from route params
const leadId = route.params.id as string;

// Reactive state
const data = ref<Lead | null>(null);
const pending = ref(true);
const error = ref<string | null>(null);

// Agent notes state
const agentNotes = ref<string>("");
const originalNotes = ref<string>("");
const isSaving = ref(false);
const saveStatus = ref<"saving" | "saved" | "error" | null>(null);

// Computed property to check if notes have changed
const notesChanged = computed(() => {
  return agentNotes.value !== originalNotes.value;
});

// Fetch lead data
onMounted(async () => {
  try {
    pending.value = true;
    error.value = null;

    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError) {
      console.error("Error loading lead:", leadError);
      error.value = leadError.message;
      return;
    }

    data.value = leadData;
    // Initialize agent notes
    agentNotes.value = leadData.agent_notes || "";
    originalNotes.value = leadData.agent_notes || "";
  } catch (err) {
    console.error("Error:", err);
    error.value = err instanceof Error ? err.message : "Failed to load lead";
  } finally {
    pending.value = false;
  }
});

// Save notes function
const saveNotes = async () => {
  if (!notesChanged.value || isSaving.value) return;

  try {
    isSaving.value = true;
    saveStatus.value = "saving";

    const response = await $fetch(`/api/leads/${leadId}/notes`, {
      method: "PATCH",
      body: {
        agent_notes: agentNotes.value,
      },
    });

    if (response.success) {
      // Update original notes to reflect saved state
      originalNotes.value = agentNotes.value;
      saveStatus.value = "saved";

      // Clear saved message after 3 seconds
      setTimeout(() => {
        if (saveStatus.value === "saved") {
          saveStatus.value = null;
        }
      }, 3000);
    } else {
      throw new Error("Failed to save notes");
    }
  } catch (err) {
    console.error("Error saving notes:", err);
    saveStatus.value = "error";

    // Clear error message after 5 seconds
    setTimeout(() => {
      if (saveStatus.value === "error") {
        saveStatus.value = null;
      }
    }, 5000);
  } finally {
    isSaving.value = false;
  }
};
</script>
