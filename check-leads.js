// Check if leads are being created in Supabase
import { supabaseOperations } from './lib/supabase.js';

async function checkLeads() {
  console.log('🔍 Checking Supabase leads...');

  try {
    const leads = await supabaseOperations.getLeads();
    console.log(`✅ Found ${leads.length} leads in database`);

    if (leads.length > 0) {
      console.log('📋 Recent leads:');
      leads.slice(0, 3).forEach((lead, index) => {
        console.log(
          `${index + 1}. ${lead.name} (${lead.email}) - ${lead.lead_source} - ${lead.status}`
        );
        console.log(
          `   Created: ${new Date(lead.created_at).toLocaleString()}`
        );
        console.log(`   Message: ${lead.message?.substring(0, 100)}...`);
        console.log('');
      });
    } else {
      console.log('📋 No leads found - database is empty');
    }
  } catch (error) {
    console.error('❌ Error accessing Supabase:', error.message);
  }
}

checkLeads();
