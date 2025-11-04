// Database types for type safety
// Note: With @nuxtjs/supabase module, use useSupabaseClient() composable instead of importing a client

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Use the generated database types instead of custom interface
export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type LeadUpdate = Database['public']['Tables']['leads']['Update'];

// Helper functions for database operations using Nuxt Supabase composables
// Usage: Import these functions and use them with useSupabaseClient() in your components

export const supabaseOperations = {
  // Create a new lead
  async createLead(supabase: SupabaseClient<Database>, leadData: LeadInsert) {
    const { data, error } = await supabase.from('leads').insert([leadData]).select();

    if (error) throw error;
    return data[0];
  },

  // Get all leads
  async getLeads(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update lead status
  async updateLeadStatus(
    supabase: SupabaseClient<Database>,
    id: string,
    status: Lead['status'],
    notes?: string,
  ) {
    const updateData: LeadUpdate = { status };
    if (notes) updateData.agent_notes = notes;

    const { data, error } = await supabase.from('leads').update(updateData).eq('id', id).select();

    if (error) throw error;
    return data[0];
  },
};
