import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const leadId = getRouterParam(event, 'id');

  if (!leadId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lead ID is required',
    });
  }

  try {
    const supabase = await serverSupabaseServiceRole(event);

    // First check if the lead exists
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name')
      .eq('id', leadId)
      .single();

    if (checkError || !existingLead) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Lead not found',
      });
    }

    // Delete the lead
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (deleteError) {
      console.error('Error deleting lead:', deleteError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete lead',
      });
    }

    return {
      success: true,
      message: `Lead ${existingLead.first_name} ${existingLead.last_name} (${existingLead.email}) has been deleted successfully`,
    };
  } catch (error) {
    // If it's already an H3Error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Unexpected error deleting lead:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
