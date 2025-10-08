// US States data for dropdown
export interface StateOption {
  name: string;
  code: string;
  displayName: string;
}

export const useStatesData = () => {
  // US States list for dropdown
  const states: StateOption[] = [
    { name: 'Alabama', code: 'AL', displayName: 'Alabama (AL)' },
    { name: 'Alaska', code: 'AK', displayName: 'Alaska (AK)' },
    { name: 'Arizona', code: 'AZ', displayName: 'Arizona (AZ)' },
    { name: 'Arkansas', code: 'AR', displayName: 'Arkansas (AR)' },
    { name: 'California', code: 'CA', displayName: 'California (CA)' },
    { name: 'Colorado', code: 'CO', displayName: 'Colorado (CO)' },
    { name: 'Connecticut', code: 'CT', displayName: 'Connecticut (CT)' },
    { name: 'Delaware', code: 'DE', displayName: 'Delaware (DE)' },
    { name: 'Florida', code: 'FL', displayName: 'Florida (FL)' },
    { name: 'Georgia', code: 'GA', displayName: 'Georgia (GA)' },
    { name: 'Hawaii', code: 'HI', displayName: 'Hawaii (HI)' },
    { name: 'Idaho', code: 'ID', displayName: 'Idaho (ID)' },
    { name: 'Illinois', code: 'IL', displayName: 'Illinois (IL)' },
    { name: 'Indiana', code: 'IN', displayName: 'Indiana (IN)' },
    { name: 'Iowa', code: 'IA', displayName: 'Iowa (IA)' },
    { name: 'Kansas', code: 'KS', displayName: 'Kansas (KS)' },
    { name: 'Kentucky', code: 'KY', displayName: 'Kentucky (KY)' },
    { name: 'Louisiana', code: 'LA', displayName: 'Louisiana (LA)' },
    { name: 'Maine', code: 'ME', displayName: 'Maine (ME)' },
    { name: 'Maryland', code: 'MD', displayName: 'Maryland (MD)' },
    { name: 'Massachusetts', code: 'MA', displayName: 'Massachusetts (MA)' },
    { name: 'Michigan', code: 'MI', displayName: 'Michigan (MI)' },
    { name: 'Minnesota', code: 'MN', displayName: 'Minnesota (MN)' },
    { name: 'Mississippi', code: 'MS', displayName: 'Mississippi (MS)' },
    { name: 'Missouri', code: 'MO', displayName: 'Missouri (MO)' },
    { name: 'Montana', code: 'MT', displayName: 'Montana (MT)' },
    { name: 'Nebraska', code: 'NE', displayName: 'Nebraska (NE)' },
    { name: 'Nevada', code: 'NV', displayName: 'Nevada (NV)' },
    { name: 'New Hampshire', code: 'NH', displayName: 'New Hampshire (NH)' },
    { name: 'New Jersey', code: 'NJ', displayName: 'New Jersey (NJ)' },
    { name: 'New Mexico', code: 'NM', displayName: 'New Mexico (NM)' },
    { name: 'New York', code: 'NY', displayName: 'New York (NY)' },
    { name: 'North Carolina', code: 'NC', displayName: 'North Carolina (NC)' },
    { name: 'North Dakota', code: 'ND', displayName: 'North Dakota (ND)' },
    { name: 'Ohio', code: 'OH', displayName: 'Ohio (OH)' },
    { name: 'Oklahoma', code: 'OK', displayName: 'Oklahoma (OK)' },
    { name: 'Oregon', code: 'OR', displayName: 'Oregon (OR)' },
    { name: 'Pennsylvania', code: 'PA', displayName: 'Pennsylvania (PA)' },
    { name: 'Rhode Island', code: 'RI', displayName: 'Rhode Island (RI)' },
    { name: 'South Carolina', code: 'SC', displayName: 'South Carolina (SC)' },
    { name: 'South Dakota', code: 'SD', displayName: 'South Dakota (SD)' },
    { name: 'Tennessee', code: 'TN', displayName: 'Tennessee (TN)' },
    { name: 'Texas', code: 'TX', displayName: 'Texas (TX)' },
    { name: 'Utah', code: 'UT', displayName: 'Utah (UT)' },
    { name: 'Vermont', code: 'VT', displayName: 'Vermont (VT)' },
    { name: 'Virginia', code: 'VA', displayName: 'Virginia (VA)' },
    { name: 'Washington', code: 'WA', displayName: 'Washington (WA)' },
    { name: 'West Virginia', code: 'WV', displayName: 'West Virginia (WV)' },
    { name: 'Wisconsin', code: 'WI', displayName: 'Wisconsin (WI)' },
    { name: 'Wyoming', code: 'WY', displayName: 'Wyoming (WY)' },
  ];

  return {
    states,
  };
};
