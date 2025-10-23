import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/types/database.types';
import { leadUpdateValidationSchema } from '../../utils/validation';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export default defineEventHandler(async (event) => {
  const leadId = getRouterParam(event, 'id');

  if (!leadId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lead ID is required',
    });
  }

  try {
    const body = await readBody(event);
    const supabase = await serverSupabaseServiceRole(event);

    // First check if the lead exists
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (checkError || !existingLead) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Lead not found',
      });
    }

    // Transform string numbers to actual numbers before validation
    const transformedBody = { ...body };
    if (transformedBody.height && typeof transformedBody.height === 'string') {
      transformedBody.height = parseFloat(transformedBody.height);
    }
    if (transformedBody.weight && typeof transformedBody.weight === 'string') {
      transformedBody.weight = parseFloat(transformedBody.weight);
    }
    if (
      transformedBody.loan_amount &&
      typeof transformedBody.loan_amount === 'string'
    ) {
      transformedBody.loan_amount = parseFloat(transformedBody.loan_amount);
    }

    // Validate the request body using Joi schema
    console.log('Validating data:', JSON.stringify(transformedBody, null, 2));

    const { error: validationError, value: validatedData } =
      leadUpdateValidationSchema.validate(transformedBody, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (validationError) {
      console.error('Joi validation error:', validationError.details);
      const errors = validationError.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { errors },
      });
    }

    console.log('Validation passed. Cleaned data:', validatedData);

    // Transform sex values to match database constraint (Male/Female instead of male/female)
    const dbData = { ...validatedData };
    if (dbData.sex) {
      if (dbData.sex === 'male') dbData.sex = 'Male';
      else if (dbData.sex === 'female') dbData.sex = 'Female';
      else if (dbData.sex === 'other') {
        // Database constraint only allows Male/Female, so remove 'other' for now
        delete dbData.sex;
      }
    }

    // Update the lead with validated data
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update(dbData)
      .eq('id', leadId)
      .select()
      .single();

    console.log('Database update result:', { updatedLead, updateError });

    if (updateError) {
      console.error('Error updating lead:', updateError);
      console.error('Detailed error:', JSON.stringify(updateError, null, 2));
      console.error(
        'Payload that caused error:',
        JSON.stringify(validatedData, null, 2)
      );
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update lead: ${updateError.message || updateError.details || 'Unknown error'}`,
        data: updateError,
      });
    }

    return {
      success: true,
      data: updatedLead,
      message: `Lead ${updatedLead.first_name} ${updatedLead.last_name} has been updated successfully`,
    };
  } catch (error) {
    // If it's already an H3Error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Unexpected error updating lead:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred while updating the lead',
    });
  }
});
