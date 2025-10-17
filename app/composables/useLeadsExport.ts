export const useLeadsExport = () => {
  const supabase = useSupabaseClient();

  interface Lead {
    id: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    message: string | null;
    date_of_birth: string | null;
    coverage_type: string | null;
    health_conditions: string | null;
    current_medications: string | null;
    lead_type: string | null;
    lead_source: string | null;
    status: string | null;
    agent_notes: string | null;
    city: string | null;
    state: string | null;
    tcpa_consent: boolean;
    tcpa_consent_timestamp: string | null;
    unsubscribed_at: string | null;
    email_marketing_consent: boolean;
    tcpa_text: string | null;
    ip_address: string | null;
    user_agent: string | null;
    form_version: string | null;
    compliance_review_status: string | null;
    sex: string | null;
    height: string | null;
    weight: string | null;
    loan_amount: number | null;
    exported_to_csv: boolean;
  }

  const leadsToCSVRow = (lead: Lead): string[] => {
    // Function to format health conditions for specific fields
    const hasHealthCondition = (
      condition: string | null,
      target: string
    ): string => {
      if (!lead.health_conditions) return '';
      return lead.health_conditions.toLowerCase().includes(target.toLowerCase())
        ? '1'
        : '0';
    };

    // Calculate age from date of birth
    const calculateAge = (dob: string | null): string => {
      if (!dob) return '';
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    };

    return [
      '', // Salutation (empty)
      lead.first_name || '',
      '', // MI (Middle Initial - not in database)
      lead.last_name || '',
      '', // Street Address (not in database)
      lead.city || '',
      lead.state || '',
      '', // County (not in database)
      '', // Zip (not in database)
      lead.date_of_birth ? formatDateForCSV(lead.date_of_birth) : '',
      lead.sex === null ? '' : lead.sex,
      lead.phone || '', // Cell Phone
      '', // Home Phone (not in database)
      '', // Work Phone (not in database)
      lead.email || '',
      '', // Spouse (not in database)
      '', // Form Filled By
      '', // Pref.Contact Method
      lead.loan_amount?.toString() || '',
      lead.height === null ? '' : lead.height,
      lead.weight === null ? '' : lead.weight,
      '', // High BP/Chol.?
      '', // Heart Problems?
      '', // Diabetes?
      '', // CO-Name (not in database)
      '', // CO-Birth Date (not in database)
      '', // CO-Age Years (not in database)
      '', // Lender (not in database)
      calculateAge(lead.date_of_birth), // Age_Years
    ];
  };

  const formatDateForCSV = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return '';
    }
  };

  const exportLeadsToCSV = async (leads: Lead[]) => {
    try {
      // CSV header - matching the sample format with specific spacing
      const headers = [
        'Salutation',
        'First Name',
        'MI',
        'Last Name',
        'Street Address',
        'City',
        'State',
        'County',
        'Zip',
        'Birth Date',
        'Sex',
        'Cell Phone',
        'Home Phone',
        'Work Phone',
        'Email',
        'Spouse',
        'Form Filled By',
        'Pref.Contact Method',
        'Loan Amount',
        'Height',
        'Weight',
        'High BP/Chol.?',
        'Heart Problems?',
        'Diabetes?',
        'CO-Name',
        'CO-Birth Date',
        'CO-Age Years',
        'Lender',
        'Age_Years',
      ];

      // CSV rows - without quotes around values
      const rows = leads.map((lead) => leadsToCSVRow(lead));

      // Combine headers and rows - using commas without spaces to match sample
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `leads_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mark leads as exported
      const leadIds = leads.map((lead) => lead.id);
      const { error } = await supabase
        .from('leads')
        .update({ exported_to_csv: true } as any)
        .in('id', leadIds);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error exporting leads to CSV:', error);
      throw error;
    }
  };

  return {
    exportLeadsToCSV,
    leadsToCSVRow,
  };
};
