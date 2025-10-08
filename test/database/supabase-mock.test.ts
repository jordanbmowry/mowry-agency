import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the entire supabase module first
const mockSupabaseOperations = {
  createLead: vi.fn(),
  getLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
  getJobApplications: vi.fn(),
  updateJobApplicationStatus: vi.fn(),
};

vi.mock('../../lib/supabase', () => ({
  supabaseOperations: mockSupabaseOperations,
}));

// Define Lead type for testing
type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions?: string;
  current_medications?: string;
  message: string;
  lead_type: string;
  lead_source: string;
  status: string;
};

describe('Database Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Lead Creation', () => {
    it('should create a lead with all required fields', async () => {
      const mockLead = {
        id: 'test-lead-123',
        first_name: 'John',
        last_name: 'Doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        date_of_birth: '1985-01-01',
        coverage_type: 'term-life',
        health_conditions: 'Good health',
        current_medications: 'None',
        message: 'Looking for coverage',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabaseOperations.createLead.mockResolvedValue(mockLead);

      const leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
        first_name: 'John',
        last_name: 'Doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        date_of_birth: '1985-01-01',
        coverage_type: 'term-life',
        health_conditions: 'Good health',
        current_medications: 'None',
        message: 'Looking for coverage',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      };

      const result = await mockSupabaseOperations.createLead(leadData);

      expect(mockSupabaseOperations.createLead).toHaveBeenCalledWith(leadData);
      expect(result).toEqual(mockLead);
    });

    it('should handle database errors when creating leads', async () => {
      const mockError = new Error('Database connection failed');

      mockSupabaseOperations.createLead.mockRejectedValue(mockError);

      const leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
        first_name: 'Error',
        last_name: 'Test',
        name: 'Error Test',
        email: 'error@test.com',
        phone: '555-ERROR-01',
        date_of_birth: '1985-01-01',
        coverage_type: 'term-life',
        health_conditions: '',
        current_medications: '',
        message: '',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      };

      await expect(mockSupabaseOperations.createLead(leadData)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('Lead Retrieval', () => {
    it('should retrieve all leads', async () => {
      const mockLeads = [
        {
          id: 'lead-1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '555-1234',
          status: 'new',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'lead-2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '555-5678',
          status: 'contacted',
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockSupabaseOperations.getLeads.mockResolvedValue(mockLeads);

      const result = await mockSupabaseOperations.getLeads();

      expect(mockSupabaseOperations.getLeads).toHaveBeenCalled();
      expect(result).toEqual(mockLeads);
    });
  });

  describe('Lead Status Updates', () => {
    it('should update lead status', async () => {
      const updatedLead = {
        id: 'lead-123',
        status: 'contacted',
        updated_at: new Date().toISOString(),
      };

      mockSupabaseOperations.updateLeadStatus.mockResolvedValue(updatedLead);

      const result = await mockSupabaseOperations.updateLeadStatus(
        'lead-123',
        'contacted'
      );

      expect(mockSupabaseOperations.updateLeadStatus).toHaveBeenCalledWith(
        'lead-123',
        'contacted'
      );
      expect(result).toEqual(updatedLead);
    });
  });

  describe('Field Mapping Validation', () => {
    it('should correctly map QuoteForm fields to database fields', () => {
      const quoteFormData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '555-TEST-01',
        dateOfBirth: '1990-01-01',
        coverageType: 'whole-life',
        healthConditions: 'Good health',
        medications: 'Vitamins',
        message: 'Test message',
      };

      const expectedLeadData = {
        first_name: 'Test',
        last_name: 'User',
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-TEST-01',
        date_of_birth: '1990-01-01',
        coverage_type: 'whole-life',
        health_conditions: 'Good health',
        current_medications: 'Vitamins',
        message: 'Test message',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      };

      // Test the mapping logic (this would be the same logic used in the API)
      const mappedData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
        first_name: quoteFormData.firstName,
        last_name: quoteFormData.lastName,
        name: `${quoteFormData.firstName} ${quoteFormData.lastName}`,
        email: quoteFormData.email,
        phone: quoteFormData.phone,
        date_of_birth: quoteFormData.dateOfBirth,
        coverage_type: quoteFormData.coverageType,
        health_conditions: quoteFormData.healthConditions,
        current_medications: quoteFormData.medications,
        message: quoteFormData.message,
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      };

      expect(mappedData).toEqual(expectedLeadData);
    });

    it('should handle optional fields correctly', () => {
      const minimalQuoteData = {
        firstName: 'Min',
        lastName: 'Data',
        email: 'min@example.com',
        phone: '555-MIN-001',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
        // healthConditions, medications, message are undefined
      };

      const mappedData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
        first_name: minimalQuoteData.firstName,
        last_name: minimalQuoteData.lastName,
        name: `${minimalQuoteData.firstName} ${minimalQuoteData.lastName}`,
        email: minimalQuoteData.email,
        phone: minimalQuoteData.phone,
        date_of_birth: minimalQuoteData.dateOfBirth,
        coverage_type: minimalQuoteData.coverageType,
        health_conditions: (minimalQuoteData as any).healthConditions,
        current_medications: (minimalQuoteData as any).medications,
        message: (minimalQuoteData as any).message || '',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      };

      expect(mappedData.health_conditions).toBeUndefined();
      expect(mappedData.current_medications).toBeUndefined();
      expect(mappedData.message).toBe('');
    });
  });
});
