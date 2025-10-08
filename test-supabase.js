// Test script to verify Supabase and API functionality
import { supabaseOperations } from '../lib/supabase.js';

async function testSupabase() {
  console.log('Testing Supabase connection...');

  try {
    // Test data for a lead
    const testLead = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-123-4567',
      message: 'This is a test lead from the form testing script',
      lead_source: 'contact_form',
      status: 'new',
    };

    console.log('Creating test lead...');
    const result = await supabaseOperations.createLead(testLead);
    console.log('✅ Supabase connection successful!');
    console.log('Created lead:', result);

    // Test fetching leads
    console.log('Fetching recent leads...');
    const leads = await supabaseOperations.getLeads();
    console.log('✅ Lead retrieval successful!');
    console.log(`Found ${leads.length} leads in database`);
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
  }
}

testSupabase();
