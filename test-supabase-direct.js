// Direct Supabase test with correct imports
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');

  try {
    // Get credentials from environment
    const supabaseUrl =
      process.env.SUPABASE_URL || 'https://evaekmusrxnycollboke.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YWVrbXVzcnhueWNvbGxib2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMjY1MzIsImV4cCI6MjA0MzkwMjUzMn0.7Z44vJrXlVXZ3ngdct0c3A_cC9FmymO';

    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log(
      '🔑 API Key (first 30 chars):',
      supabaseKey.substring(0, 30) + '...'
    );

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check if leads table exists
    console.log('\n📋 Testing leads table...');
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(5);

    if (leadsError) {
      console.error('❌ Leads table error:', leadsError.message);
      if (leadsError.message.includes('relation "leads" does not exist')) {
        console.log('🚨 ISSUE: The "leads" table does not exist!');
        console.log(
          '📝 You need to run the SQL setup script in your Supabase dashboard.'
        );
      }
    } else {
      console.log(`✅ Leads table exists! Found ${leads.length} records`);
      if (leads.length > 0) {
        console.log('📄 Sample records:', leads);
      }
    }

    // Test 2: Try to insert a test record
    console.log('\n🧪 Testing insert capability...');
    const testLead = {
      name: 'Test Connection',
      email: 'test@connection.com',
      phone: '555-TEST-123',
      message: 'Testing Supabase connection from script',
      lead_source: 'contact_form',
      status: 'new',
    };

    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([testLead])
      .select();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful!');
      console.log('📝 Created record:', insertData[0]);
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testSupabaseConnection();
