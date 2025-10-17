//Admin dashboard with quotes list
<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-black">
    <Container class="py-16">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <button
          @click="handleSignOut"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
        >
          Sign Out
        </button>
      </div>

      <div class="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-zinc-200 dark:divide-zinc-700">
          <li v-for="quote in quotes" :key="quote.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {{ quote.first_name }} {{ quote.last_name }}
                </h3>
                <div class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <p>Email: {{ quote.email }}</p>
                  <p>Phone: {{ quote.phone }}</p>
                  <p>Coverage Type: {{ quote.coverage_type }}</p>
                  <p>Created: {{ formatDate(quote.created_at) }}</p>
                </div>
                <div class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <p>Message: {{ quote.message }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/lib/formatDate";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  coverage_type?: string | null;
  message?: string | null;
  created_at: string;
}

definePageMeta({
  middleware: ["admin"],
});

const supabase = useSupabaseClient();
const quotes = ref<Lead[]>([]);
const loading = ref(true);

// Fetch quotes on mount
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    quotes.value = data;
  } catch (e) {
    console.error("Error fetching quotes:", e);
  } finally {
    loading.value = false;
  }
});

// Sign out handler
async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigateTo("/admin/login");
  } catch (e) {
    console.error("Error signing out:", e);
  }
}
</script>
