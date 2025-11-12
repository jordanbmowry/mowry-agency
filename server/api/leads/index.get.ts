import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface LeadsApiResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  message?: string;
}

export default defineEventHandler(async (event): Promise<LeadsApiResponse> => {
  try {
    const query = getQuery(event);
    const supabase = serverSupabaseServiceRole(event);

    // Parse query parameters
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 10;
    const search = (query.search as string) || '';
    const status = (query.status as string) || '';
    const dateFrom = (query.dateFrom as string) || '';
    const dateTo = (query.dateTo as string) || '';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build base query
    let countQuery = supabase.from('leads').select('*', { count: 'exact', head: true });
    let dataQuery = supabase.from('leads').select('*').order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      const searchFilter = `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`;
      countQuery = countQuery.or(searchFilter);
      dataQuery = dataQuery.or(searchFilter);
    }

    if (status) {
      countQuery = countQuery.eq('status', status);
      dataQuery = dataQuery.eq('status', status);
    }

    if (dateFrom) {
      const fromDate = `${dateFrom}T00:00:00`;
      countQuery = countQuery.gte('created_at', fromDate);
      dataQuery = dataQuery.gte('created_at', fromDate);
    }

    if (dateTo) {
      const toDate = `${dateTo}T23:59:59`;
      countQuery = countQuery.lte('created_at', toDate);
      dataQuery = dataQuery.lte('created_at', toDate);
    }

    // Get total count
    const { count, error: countError } = await countQuery;
    if (countError) {
      console.error('Count query error:', countError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to count leads',
        data: countError,
      });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await dataQuery.range(offset, offset + limit - 1);

    if (error) {
      console.error('Data query error:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch leads',
        data: error,
      });
    }

    return {
      success: true,
      data: data || [],
      pagination: {
        total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  } catch (error) {
    console.error('Leads API error:', error);

    // Check if it's already a proper H3 error
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
