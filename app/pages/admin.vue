<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-900">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Lead Management Dashboard
        </h1>
        <p class="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage leads and job applications from your website forms
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'leads'"
            :class="[
              activeTab === 'leads'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            Contact Leads
            <span
              class="ml-2 px-2 py-1 text-xs rounded-full"
              :class="
                activeTab === 'leads'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-zinc-100 text-zinc-800'
              "
            >
              {{ leads?.length || 0 }}
            </span>
          </button>
          <button
            @click="activeTab = 'applications'"
            :class="[
              activeTab === 'applications'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            Job Applications
            <span
              class="ml-2 px-2 py-1 text-xs rounded-full"
              :class="
                activeTab === 'applications'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-zinc-100 text-zinc-800'
              "
            >
              {{ applications?.length || 0 }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Leads Tab -->
      <div v-if="activeTab === 'leads'" class="space-y-6">
        <div v-if="pending" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">Loading leads...</p>
        </div>

        <div v-else-if="!leads || leads.length === 0" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">No leads found.</p>
        </div>

        <div v-else class="grid gap-6">
          <div
            v-for="lead in leads"
            :key="lead.id"
            class="bg-white dark:bg-zinc-800 rounded-lg shadow p-6"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3
                    class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {{ lead.name }}
                  </h3>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(lead.status),
                    ]"
                  >
                    {{ formatStatus(lead.status) }}
                  </span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{
                      lead.lead_source === 'contact_form'
                        ? 'Contact Form'
                        : 'Join Us Form'
                    }}
                  </span>
                </div>

                <div class="mt-2 space-y-1">
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Email:</span>
                    <a
                      :href="`mailto:${lead.email}`"
                      class="text-teal-600 hover:text-teal-500"
                    >
                      {{ lead.email }}
                    </a>
                  </p>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Phone:</span>
                    <a
                      :href="`tel:${lead.phone}`"
                      class="text-teal-600 hover:text-teal-500"
                    >
                      {{ lead.phone }}
                    </a>
                  </p>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Submitted:</span>
                    {{ formatDate(lead.created_at) }}
                  </p>
                </div>

                <div v-if="lead.message" class="mt-4">
                  <p
                    class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    Message:
                  </p>
                  <p
                    class="mt-1 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap"
                  >
                    {{ lead.message }}
                  </p>
                </div>

                <div v-if="lead.agent_notes" class="mt-4">
                  <p
                    class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    Agent Notes:
                  </p>
                  <p
                    class="mt-1 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap"
                  >
                    {{ lead.agent_notes }}
                  </p>
                </div>
              </div>

              <div class="ml-4 flex flex-col space-y-2">
                <select
                  v-model="lead.status"
                  @change="updateLeadStatus(lead.id, lead.status)"
                  class="text-sm border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-700"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                  <option value="not_interested">Not Interested</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Applications Tab -->
      <div v-if="activeTab === 'applications'" class="space-y-6">
        <div v-if="pending" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">
            Loading applications...
          </p>
        </div>

        <div
          v-else-if="!applications || applications.length === 0"
          class="text-center py-8"
        >
          <p class="text-zinc-600 dark:text-zinc-400">
            No job applications found.
          </p>
        </div>

        <div v-else class="grid gap-6">
          <div
            v-for="application in applications"
            :key="application.id"
            class="bg-white dark:bg-zinc-800 rounded-lg shadow p-6"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3
                    class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {{ application.first_name }} {{ application.last_name }}
                  </h3>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(application.status),
                    ]"
                  >
                    {{ formatStatus(application.status) }}
                  </span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {{ application.position }}
                  </span>
                </div>

                <div class="mt-2 space-y-1">
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Email:</span>
                    <a
                      :href="`mailto:${application.email}`"
                      class="text-teal-600 hover:text-teal-500"
                    >
                      {{ application.email }}
                    </a>
                  </p>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Phone:</span>
                    <a
                      :href="`tel:${application.phone}`"
                      class="text-teal-600 hover:text-teal-500"
                    >
                      {{ application.phone }}
                    </a>
                  </p>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Location:</span>
                    {{ application.state }}
                  </p>
                  <p
                    v-if="application.experience"
                    class="text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span class="font-medium">Experience:</span>
                    {{ application.experience }}
                  </p>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium">Applied:</span>
                    {{ formatDate(application.created_at) }}
                  </p>
                </div>

                <div v-if="application.message" class="mt-4">
                  <p
                    class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    Message:
                  </p>
                  <p
                    class="mt-1 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap"
                  >
                    {{ application.message }}
                  </p>
                </div>
              </div>

              <div class="ml-4 flex flex-col space-y-2">
                <select
                  v-model="application.status"
                  @change="
                    updateApplicationStatus(application.id, application.status)
                  "
                  class="text-sm border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-700"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interview_scheduled">
                    Interview Scheduled
                  </option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabaseOperations } from '~/lib/supabase';

// Set page metadata
useSeoMeta({
  title: 'Admin Dashboard - Mowry Agency',
  description: 'Manage leads and job applications',
  robots: 'noindex, nofollow',
});

// Component state
const activeTab = ref('leads');

// Fetch data
const {
  data: leads,
  pending: leadsPending,
  refresh: refreshLeads,
} = await useAsyncData('admin-leads', () => supabaseOperations.getLeads());

const {
  data: applications,
  pending: appsPending,
  refresh: refreshApplications,
} = await useAsyncData('admin-applications', () =>
  supabaseOperations.getJobApplications()
);

const pending = computed(() => leadsPending.value || appsPending.value);

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getStatusColor = (status: string) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    interview_scheduled: 'bg-purple-100 text-purple-800',
    hired: 'bg-green-100 text-green-800',
    closed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    not_interested: 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Update functions
const updateLeadStatus = async (id: string, status: string) => {
  try {
    await supabaseOperations.updateLeadStatus(id, status as any);
    await refreshLeads();
  } catch (error) {
    console.error('Failed to update lead status:', error);
    alert('Failed to update lead status');
  }
};

const updateApplicationStatus = async (id: string, status: string) => {
  try {
    await supabaseOperations.updateJobApplicationStatus(id, status as any);
    await refreshApplications();
  } catch (error) {
    console.error('Failed to update application status:', error);
    alert('Failed to update application status');
  }
};
</script>
