import type { Database } from '~/types/database.types';

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();

  if (!user.value) {
    return navigateTo('/admin/login');
  }

  try {
    // Get user details including custom claims/metadata
    const {
      data: { user: userDetails },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !userDetails?.id) throw userError;

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userDetails.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.role !== 'admin') {
      // If user is not an admin, redirect to home
      return navigateTo('/');
    }
  } catch (_error) {
    // If there's any error, redirect to login
    return navigateTo('/admin/login');
  }
});
