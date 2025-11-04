import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/types/database.types';

export default defineEventHandler(async (event) => {
  const leadId = getRouterParam(event, 'id');

  if (!leadId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lead ID is required',
    });
  }

  try {
    // Use Nuxt Supabase helper instead of createClient
    const supabase = serverSupabaseServiceRole<Database>(event);

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

    // First, delete any associated compliance reports
    // This must happen before deleting the lead due to foreign key constraints
    const { error: complianceDeleteError } = await supabase
      .from('leads_compliance_report')
      .delete()
      .eq('lead_id', leadId);

    if (complianceDeleteError) {
      console.error('Error deleting compliance reports:', complianceDeleteError);
      // Don't fail the entire operation if compliance report deletion fails
      // The lead might not have a compliance report entry
    }

    // Delete the lead
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', leadId);

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
