
export type LeadStatus = 'Not Contacted' | 'Contacted' | 'Converted';

export interface Lead {
  id: string;
  name: string;
  industry: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  reason: string;
  status: LeadStatus;
  notes: string;
}

export interface FilterOptions {
  location: string;
  industry: string;
  websiteStatus: string;
}
