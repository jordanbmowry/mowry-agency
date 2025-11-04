// License information and business constants for Mowry Agency
// This file contains all licensing information that needs to be displayed
// for compliance across emails, website footer, and other communications

export interface LicenseInfo {
  state: string;
  stateCode: string;
  licenseNumber: string;
}

export interface BusinessInfo {
  businessName: string;
  ownerEntity: string;
  npn: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

// Helper to get agency NPN from environment variable
const getAgencyNpn = (): string => {
  // This will be replaced by runtime config in components
  return process.env.AGENCY_NPN || '16357772';
};

// State licenses - Update this array when licenses change
export const STATE_LICENSES: LicenseInfo[] = [
  { state: 'Alabama', stateCode: 'AL', licenseNumber: '3003564119' },
  { state: 'Arkansas', stateCode: 'AR', licenseNumber: getAgencyNpn() },
  { state: 'Arizona', stateCode: 'AZ', licenseNumber: getAgencyNpn() },
  { state: 'California', stateCode: 'CA', licenseNumber: '0187103' },
  { state: 'Colorado', stateCode: 'CO', licenseNumber: '446511' },
  { state: 'Connecticut', stateCode: 'CT', licenseNumber: getAgencyNpn() },
  { state: 'Florida', stateCode: 'FL', licenseNumber: 'G223894' },
  { state: 'Georgia', stateCode: 'GA', licenseNumber: '3784798' },
  { state: 'Iowa', stateCode: 'IA', licenseNumber: getAgencyNpn() },
  { state: 'Idaho', stateCode: 'ID', licenseNumber: getAgencyNpn() },
  { state: 'Illinois', stateCode: 'IL', licenseNumber: getAgencyNpn() },
  { state: 'Indiana', stateCode: 'IN', licenseNumber: '4085378' },
  { state: 'Massachusetts', stateCode: 'MA', licenseNumber: '1637772' },
  { state: 'Maryland', stateCode: 'MD', licenseNumber: '3003518353' },
  { state: 'Michigan', stateCode: 'MI', licenseNumber: getAgencyNpn() },
  { state: 'Minnesota', stateCode: 'MN', licenseNumber: '40260160' },
  { state: 'Missouri', stateCode: 'MO', licenseNumber: '3003518359' },
  { state: 'Montana', stateCode: 'MT', licenseNumber: '100136632' },
  { state: 'North Carolina', stateCode: 'NC', licenseNumber: getAgencyNpn() },
  { state: 'Nebraska', stateCode: 'NE', licenseNumber: getAgencyNpn() },
  { state: 'New Jersey', stateCode: 'NJ', licenseNumber: '3003561084' },
  { state: 'New Mexico', stateCode: 'NM', licenseNumber: getAgencyNpn() },
  { state: 'Nevada', stateCode: 'NV', licenseNumber: '787094' },
  { state: 'Ohio', stateCode: 'OH', licenseNumber: '1645455' },
  { state: 'Pennsylvania', stateCode: 'PA', licenseNumber: '1234889' },
  { state: 'South Carolina', stateCode: 'SC', licenseNumber: getAgencyNpn() },
  { state: 'South Dakota', stateCode: 'SD', licenseNumber: '40174465' },
  { state: 'Tennessee', stateCode: 'TN', licenseNumber: '3003536895' },
  { state: 'Texas', stateCode: 'TX', licenseNumber: '3302151' },
  { state: 'Utah', stateCode: 'UT', licenseNumber: '1070279' },
  { state: 'Virginia', stateCode: 'VA', licenseNumber: '1493977' },
  { state: 'Washington', stateCode: 'WA', licenseNumber: '792132' },
  { state: 'Wisconsin', stateCode: 'WI', licenseNumber: getAgencyNpn() },
  { state: 'Wyoming', stateCode: 'WY', licenseNumber: '229623' },
];

// Get runtime config values - this will work in both client and server contexts
const getRuntimeBusinessInfo = (): BusinessInfo => {
  if (process.client) {
    const { $config } = useNuxtApp();
    return {
      businessName: 'Mowry Agency',
      ownerEntity: 'Mowry Digital Enterprise LLC',
      npn: $config.public.agencyNpn || getAgencyNpn(),
      email: $config.public.agencyEmail || 'info@mowryagency.com',
      phone: $config.public.agencyPhone || '(930) 322-1962',
      website: $config.public.agencyWebsite || 'https://mowryagency.com',
      address: $config.public.agencyAddress || '[Your business or mailing address]',
    };
  } else {
    // Server-side fallback - actual values will be provided by the server components
    return {
      businessName: 'Mowry Agency',
      ownerEntity: 'Mowry Digital Enterprise LLC',
      npn: getAgencyNpn(),
      email: process.env.AGENCY_EMAIL || 'info@mowryagency.com',
      phone: process.env.AGENCY_PHONE || '(930) 322-1962',
      website: process.env.AGENCY_WEBSITE || 'https://mowryagency.com',
      address: process.env.AGENCY_ADDRESS || '[Your business or mailing address]',
    };
  }
};

// Business information - use runtime config when available
export const BUSINESS_INFO: BusinessInfo = {
  businessName: 'Mowry Agency',
  ownerEntity: 'Mowry Digital Enterprise LLC',
  npn: getAgencyNpn(), // Will be replaced by runtime config in components
  email: 'info@mowryagency.com',
  phone: '(930) 322-1962',
  website: 'https://mowryagency.com',
  address: '123 Main Street, Anytown, TX 75001', // Replace with actual business address
};

// Helper functions for formatting license information
export const formatLicenseDisplay = (format: 'short' | 'full' = 'short'): string => {
  if (format === 'short') {
    return STATE_LICENSES.map((license) => `${license.stateCode} (#${license.licenseNumber})`).join(
      ', ',
    );
  } else {
    return STATE_LICENSES.map((license) => `${license.state} (#${license.licenseNumber})`).join(
      ', ',
    );
  }
};

export const formatLicenseList = (): string => {
  return STATE_LICENSES.map((license) => `${license.stateCode} (#${license.licenseNumber})`).join(
    ', ',
  );
};

// Get licensed state codes only
export const getLicensedStateCodes = (): string[] => {
  return STATE_LICENSES.map((license) => license.stateCode);
};

// Check if licensed in a specific state
export const isLicensedInState = (stateCode: string): boolean => {
  return STATE_LICENSES.some(
    (license) => license.stateCode.toLowerCase() === stateCode.toLowerCase(),
  );
};

// Compliance disclaimers
export const COMPLIANCE_DISCLAIMERS = {
  quote:
    'Quotes are provided by a licensed insurance agent. Coverage availability, rates, and policy features may vary by state and insurer. Submission of this form does not obligate you to purchase insurance. Policies are subject to underwriting approval.',
  licensing: `${BUSINESS_INFO.businessName} is owned and operated by ${BUSINESS_INFO.ownerEntity}.`,
  npn: `National Producer Number (NPN): ${BUSINESS_INFO.npn}`, // This will be replaced by runtime config in components
} as const;

// Get runtime compliance disclaimers with dynamic NPN
export const getRuntimeComplianceDisclaimers = (npn?: string) => {
  const businessInfo = getRuntimeBusinessInfo();
  const agencyNpn = npn || businessInfo.npn;

  return {
    quote: COMPLIANCE_DISCLAIMERS.quote,
    licensing: `${businessInfo.businessName} is owned and operated by ${businessInfo.ownerEntity}.`,
    npn: `National Producer Number (NPN): ${agencyNpn}`,
  };
};
