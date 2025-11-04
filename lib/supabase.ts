// Database types for type safety
// Note: With @nuxtjs/supabase module, use useSupabaseClient() composable instead of importing a client

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../app/types/database.types';

export interface Lead {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;

  // Quote form fields
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  coverage_type?: string;
  health_conditions?: string;
  current_medications?: string;
  message?: string;

  // Lead management
  lead_type?: string;
  lead_source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'not_interested';
  agent_notes?: string;
}

// Helper functions for database operations using Nuxt Supabase composables
// Usage: Import these functions and use them with useSupabaseClient() in your components

export const supabaseOperations = {
  // Create a new lead
  async createLead(
    supabase: SupabaseClient<Database>,
    leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>,
  ) {
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
    const updateData: Partial<Lead> = { status };
    if (notes) updateData.agent_notes = notes;

    const { data, error } = await supabase.from('leads').update(updateData).eq('id', id).select();

    if (error) throw error;
    return data[0];
  },
};
