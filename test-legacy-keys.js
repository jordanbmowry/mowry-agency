// Test both legacy anon and service role keys
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseKeys() {
  console.log('🔍 Testing Supabase Legacy API Keys...');

  const supabaseUrl = 'https://evaekmusrxnycollboke.supabase.co';

  // Test with anon key
  console.log('\n1️⃣ Testing with Legacy Anon Key...');
  const anonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YWVrbXVzcnhueWNvbGxib2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDg3NjcsImV4cCI6MjA3NTQyNDc2N30.w_fdTZdJcPPI3t8V9ZFNUOoWzVrZXkSd9VXoEzl0fcw';

  try {
    const supabaseAnon = createClient(supabaseUrl, anonKey);

    // Test table access
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('leads')
      .select('count(*)')
      .limit(1);

    if (anonError) {
      console.log('❌ Anon key error:', anonError.message);
      if (anonError.message.includes('relation "leads" does not exist')) {
        console.log('🚨 Tables not created yet - this is expected');
      }
    } else {
      console.log('✅ Anon key working! Can access leads table');
    }
  } catch (error) {
    console.log('❌ Anon key failed:', error.message);
  }

  // Test with service role key (for admin operations)
  console.log('\n2️⃣ Testing with Legacy Service Role Key...');
  const serviceKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YWVrbXVzcnhueWNvbGxib2tlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg0ODc2NywiZXhwIjoyMDc1NDI0NzY3fQ.OWxSo4PJ4QH4yuoeYWm_T4sY23NUHRz4A7PHsV3M-oo';

  try {
    const supabaseService = createClient(supabaseUrl, serviceKey);

    // Test table access with admin privileges
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('leads')
      .select('count(*)')
      .limit(1);

    if (serviceError) {
      console.log('❌ Service key error:', serviceError.message);
    } else {
      console.log('✅ Service key working! Can access leads table');
    }
  } catch (error) {
    console.log('❌ Service key failed:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('- Both keys are from Legacy API Keys section');
  console.log('- Anon key should be used for client-side operations');
  console.log('- Service role key has admin privileges');
  console.log(
    "- If tables don't exist, run the SQL setup in Supabase dashboard"
  );
}

testSupabaseKeys();
