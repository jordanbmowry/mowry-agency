import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    // Get lead ID from route params
    const leadId = getRouterParam(event, 'id');

    if (!leadId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Lead ID is required',
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { agent_notes } = body;

    // Validate that agent_notes is a string or null
    if (agent_notes !== null && typeof agent_notes !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid agent_notes format',
      });
    }

    // Get Supabase client
    const supabase = await serverSupabaseServiceRole(event);

    // Update the lead's agent_notes
    const { data, error } = await supabase
      .from('leads')
      .update({ agent_notes })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating agent notes:', error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update agent notes: ${error.message}`,
      });
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error in notes.patch.ts:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
