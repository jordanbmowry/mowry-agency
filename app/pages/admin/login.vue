// Admin login page
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-black"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-100"
        >
          Admin Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <span v-if="loading" class="h-5 w-5">
                <!-- Add a loading spinner here if needed -->
              </span>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div v-if="error" class="text-red-600 text-center mt-2">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient<any>();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  try {
    loading.value = true;
    error.value = '';

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: email.value,
        password: password.value,
      }
    );

    if (signInError) throw signInError;

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user?.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    // Redirect to admin dashboard
    router.push('/admin');
  } catch (e: any) {
    error.value = e.message || 'An error occurred during sign in';
  } finally {
    loading.value = false;
  }
}
</script>
