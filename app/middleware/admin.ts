export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (!user.value) {
    return navigateTo('/admin/login');
  }

  try {
    // Get user details including custom claims/metadata
    const {
      data: { user: userDetails },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    // Get user profile with role
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', userDetails?.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.role !== 'admin') {
      // If user is not an admin, redirect to home
      return navigateTo('/');
    }
  } catch (error) {
    // If there's any error, redirect to login
    return navigateTo('/admin/login');
  }
});
