/**
 * Formatters Composable
 * Pure functions to format database values for human-friendly display
 * Using functional programming principles
 */

/**
 * Convert snake_case to Title Case
 * @example formatSnakeToTitle('coverage_type') => 'Coverage Type'
 */
export const formatSnakeToTitle = (text: string): string => {
  if (!text) return '';

  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Convert kebab-case to Title Case
 * @example formatKebabToTitle('term-life') => 'Term Life'
 */
export const formatKebabToTitle = (text: string): string => {
  if (!text) return '';

  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format coverage type for display
 * Maps database values to human-readable labels
 */
export const formatCoverageType = (type: string | null): string => {
  if (!type) return 'N/A';

  const coverageTypeMap: Record<string, string> = {
    'term-life': 'Term Life Insurance',
    'whole-life': 'Whole Life Insurance',
    iul: 'Indexed Universal Life (IUL)',
    'mortgage-protection': 'Mortgage Protection',
    'final-expense': 'Final Expense Insurance',
    'not-sure': 'Not Sure / Need Guidance',
    // Legacy values (if any exist in DB)
    'universal-life': 'Universal Life Insurance',
    disability: 'Disability Insurance',
    annuities: 'Annuities',
    other: 'Other',
  };

  return coverageTypeMap[type] || formatKebabToTitle(type);
};

/**
 * Format status for display
 * Maps database values to human-readable labels
 */
export const formatStatus = (status: string | null): string => {
  if (!status) return 'New';

  const statusMap: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    contacted: 'Contacted',
    quoted: 'Quoted',
    closed: 'Closed',
  };

  return statusMap[status] || formatSnakeToTitle(status);
};

/**
 * Format sex/gender for display
 */
export const formatSex = (sex: string | null): string => {
  if (!sex) return 'N/A';

  const sexMap: Record<string, string> = {
    male: 'Male',
    female: 'Female',
  };

  return (
    sexMap[sex.toLowerCase()] ||
    sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()
  );
};

/**
 * Format health conditions for display
 */
export const formatHealthConditions = (conditions: string | null): string => {
  if (!conditions) return 'None reported';
  if (
    conditions.toLowerCase() === 'none' ||
    conditions.toLowerCase() === 'n/a'
  ) {
    return 'None reported';
  }
  return conditions;
};

/**
 * Format medications for display
 */
export const formatMedications = (medications: string | null): string => {
  if (!medications) return 'None reported';
  if (
    medications.toLowerCase() === 'none' ||
    medications.toLowerCase() === 'n/a'
  ) {
    return 'None reported';
  }
  return medications;
};

/**
 * Format date for display
 */
export const formatDate = (date: string | null | Date): string => {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date: string | null | Date): string => {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Format height in feet/decimal format for display
 * @example formatHeight(5.8) => '5\'8"'
 */
export const formatHeight = (height: number | string | null): string => {
  if (!height) return 'N/A';

  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  if (isNaN(heightNum)) return 'N/A';

  const feet = Math.floor(heightNum);
  const inches = Math.round((heightNum - feet) * 10);

  return `${feet}'${inches}"`;
};

/**
 * Format weight for display
 */
export const formatWeight = (weight: number | string | null): string => {
  if (!weight) return 'N/A';

  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  if (isNaN(weightNum)) return 'N/A';

  return `${weightNum} lbs`;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number | string | null): string => {
  if (amount === null || amount === undefined) return 'N/A';

  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(amountNum)) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountNum);
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string | null): string => {
  if (!phone) return 'N/A';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX if 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Format as +X (XXX) XXX-XXXX if 11 digits (country code)
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original if not standard format
  return phone;
};

/**
 * Composable to access all formatters
 */
export const useFormatters = () => {
  return {
    formatSnakeToTitle,
    formatKebabToTitle,
    formatCoverageType,
    formatStatus,
    formatSex,
    formatHealthConditions,
    formatMedications,
    formatDate,
    formatDateTime,
    formatHeight,
    formatWeight,
    formatCurrency,
    formatPhone,
  };
};
