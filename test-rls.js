// Quick test script to debug RLS
import { createClient } from '@supabase/supabase-js';

// Use your environment variables
const supabaseUrl = 'https://evaekmusrxnycollboke.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YWVrbXVzcnhueWNvbGxib2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDg3NjcsImV4cCI6MjA3NTQyNDc2N30.w_fdTZdJcPPI3t8V9ZFNUOoWzVrZXkSd9VXoEzl0fcw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing RLS insert...');
  
  const testData = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: '555-123-4567',
    date_of_birth: '1990-01-01',
    coverage_type: 'term-life',
    health_conditions: 'Good health',
    current_medications: 'None',
    message: 'Test message',
    lead_type: 'insurance_quote',
    lead_source: 'quote_form',
    status: 'new',
  };

  const { data, error } = await supabase
    .from('leads')
    .insert([testData])
    .select();

  if (error) {
    console.error('❌ Insert failed:', error);
  } else {
    console.log('✅ Insert successful:', data);
  }
}

testInsert();