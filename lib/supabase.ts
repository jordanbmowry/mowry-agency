import { createClient } from '@supabase/supabase-js';

// Database types for type safety - simplified single leads table
export interface Lead {
  id?: string;
  created_at?: string;
  updated_at?: string;

  // Quote form fields
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions: string;
  current_medications: string;
  message?: string;

  // Lead management
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'not_interested';
}

export interface JobApplication {
  // Removed - not used in current application
}

const config = useRuntimeConfig();

function createSupabaseClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

// Helper functions for database operations
export const supabaseOperations = {
  // Create a new lead
  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Get all leads
  async getLeads() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update lead status
  async updateLeadStatus(id: string, status: Lead['status']) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },
};

// Create Supabase client factory function for server-side usage
export function createSupabaseClient() {
  const config = useRuntimeConfig();

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_ANON_KEY must be configured in runtime config'
    );
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

// Helper functions for database operations
export const supabaseOperations = {
  // Create a new lead
  async createLead(leadData: Omit<Lead, 'id' | 'created_at'>) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Create a new job application
  async createJobApplication(
    applicationData: Omit<JobApplication, 'id' | 'created_at'>
  ) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Get all leads
  async getLeads() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all job applications
  async getJobApplications() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update lead status
  async updateLeadStatus(id: string, status: Lead['status'], notes?: string) {
    const supabase = createSupabaseClient();
    const updateData: Partial<Lead> = { status };
    if (notes) updateData.agent_notes = notes;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update job application status
  async updateJobApplicationStatus(
    id: string,
    status: JobApplication['status']
  ) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },
};
