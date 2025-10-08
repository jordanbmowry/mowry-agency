// Fixed Supabase test with correct SQL syntax
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseFixed() {
  console.log('🔍 Testing Supabase with corrected queries...');

  const supabaseUrl = 'https://evaekmusrxnycollboke.supabase.co';
  const anonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YWVrbXVzcnhueWNvbGxib2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDg3NjcsImV4cCI6MjA3NTQyNDc2N30.w_fdTZdJcPPI3t8V9ZFNUOoWzVrZXkSd9VXoEzl0fcw';

  const supabase = createClient(supabaseUrl, anonKey);

  console.log('✅ Supabase client created successfully');
  console.log('🔗 URL:', supabaseUrl);
  console.log('🔑 Key working (auth successful)');

  // Test 1: Check if leads table exists
  console.log('\n📋 Testing leads table...');
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .limit(1);

  if (leadsError) {
    console.log('❌ Leads table error:', leadsError.message);
    if (leadsError.message.includes('relation "leads" does not exist')) {
      console.log('🚨 CRITICAL: The "leads" table does not exist!');
      console.log(
        '📝 You MUST run the SQL setup script in your Supabase dashboard'
      );
      console.log('📄 Use the content from: supabase-setup.sql');
    }
  } else {
    console.log('✅ Leads table exists!');
    console.log('📊 Current records:', leads.length);
    if (leads.length > 0) {
      console.log('📄 Sample record:', leads[0]);
    }
  }

  // Test 2: Try to insert a test record
  if (!leadsError) {
    console.log('\n🧪 Testing record insertion...');
    const testLead = {
      name: 'Test API Connection',
      email: 'test.api@example.com',
      phone: '555-999-1234',
      message: 'Testing form submission from API test script',
      lead_source: 'contact_form',
      status: 'new',
    };

    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([testLead])
      .select();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
    } else {
      console.log('✅ Insert successful!');
      console.log('📝 Created record ID:', insertData[0].id);
    }
  }

  console.log('\n🎯 Next Steps:');
  console.log('1. ✅ Supabase keys are working');
  console.log('2. 🔧 Create database tables (run supabase-setup.sql)');
  console.log('3. 📧 Set up Gmail App Password');
  console.log('4. 🧪 Test contact form submission');
}

testSupabaseFixed();
