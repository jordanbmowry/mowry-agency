import { describe, expect, it } from 'vitest';
import { formatLeadType, formatStatus } from '../../app/composables/useFormatters';
import { mapCoverageTypeToLeadType } from '../../server/utils/form-utils';
import { leadUpdateValidationSchema } from '../../server/utils/validation';

describe('Lead Type and Status Validation (mowry_agency)', () => {
  describe('Status Enum Validation (Joi)', () => {
    it('should accept all valid status values', async () => {
      const validStatuses = [
        'new',
        'contacted',
        'qualified',
        'converted',
        'lost',
        'closed',
        'not_interested',
      ];

      for (const status of validStatuses) {
        const { error } = leadUpdateValidationSchema.validate({ status });
        expect(error).toBeUndefined();
      }
    });

    it('should reject invalid status values', async () => {
      const invalidStatuses = ['in_progress', 'quoted', 'pending', 'invalid'];

      for (const status of invalidStatuses) {
        const { error } = leadUpdateValidationSchema.validate({ status });
        expect(error).toBeDefined();
        expect(error?.message).toContain('Please select a valid status');
      }
    });
  });

  describe('Coverage Type to Lead Type Mapping', () => {
    it('should map term-life to term', () => {
      expect(mapCoverageTypeToLeadType('term-life')).toBe('term');
    });

    it('should map whole-life to whole_life', () => {
      expect(mapCoverageTypeToLeadType('whole-life')).toBe('whole_life');
    });

    it('should map iul to universal', () => {
      expect(mapCoverageTypeToLeadType('iul')).toBe('universal');
    });

    it('should map mortgage-protection to mortgage_protection', () => {
      expect(mapCoverageTypeToLeadType('mortgage-protection')).toBe('mortgage_protection');
    });

    it('should map final-expense to final_expense', () => {
      expect(mapCoverageTypeToLeadType('final-expense')).toBe('final_expense');
    });

    it('should default to term for not-sure', () => {
      expect(mapCoverageTypeToLeadType('not-sure')).toBe('term');
    });

    it('should default to term for unknown values', () => {
      expect(mapCoverageTypeToLeadType('unknown')).toBe('term');
    });
  });

  describe('Lead Type Formatter', () => {
    it('should format mortgage_protection correctly', () => {
      expect(formatLeadType('mortgage_protection')).toBe('Mortgage Protection');
    });

    it('should format term correctly', () => {
      expect(formatLeadType('term')).toBe('Term Life');
    });

    it('should format whole_life correctly', () => {
      expect(formatLeadType('whole_life')).toBe('Whole Life');
    });

    it('should format universal correctly', () => {
      expect(formatLeadType('universal')).toBe('Universal Life');
    });

    it('should format final_expense correctly', () => {
      expect(formatLeadType('final_expense')).toBe('Final Expense');
    });

    it('should return N/A for null', () => {
      expect(formatLeadType(null)).toBe('N/A');
    });
  });

  describe('Status Formatter', () => {
    it('should format new correctly', () => {
      expect(formatStatus('new')).toBe('New');
    });

    it('should format contacted correctly', () => {
      expect(formatStatus('contacted')).toBe('Contacted');
    });

    it('should format qualified correctly', () => {
      expect(formatStatus('qualified')).toBe('Qualified');
    });

    it('should format converted correctly', () => {
      expect(formatStatus('converted')).toBe('Converted');
    });

    it('should format lost correctly', () => {
      expect(formatStatus('lost')).toBe('Lost');
    });

    it('should format closed correctly', () => {
      expect(formatStatus('closed')).toBe('Closed');
    });

    it('should format not_interested correctly', () => {
      expect(formatStatus('not_interested')).toBe('Not Interested');
    });

    it('should return New for null', () => {
      expect(formatStatus(null)).toBe('New');
    });
  });

  describe('Form Data Transformation', () => {
    it('should transform coverage_type to valid lead_type values', () => {
      const validLeadTypes = [
        'mortgage_protection',
        'term',
        'whole_life',
        'universal',
        'final_expense',
      ];

      const testCases = [
        { coverage: 'term-life', expected: 'term' },
        { coverage: 'whole-life', expected: 'whole_life' },
        { coverage: 'iul', expected: 'universal' },
        { coverage: 'mortgage-protection', expected: 'mortgage_protection' },
        { coverage: 'final-expense', expected: 'final_expense' },
      ];

      testCases.forEach(({ coverage, expected }) => {
        const leadType = mapCoverageTypeToLeadType(coverage);
        expect(leadType).toBe(expected);
        expect(validLeadTypes).toContain(leadType);
      });
    });

    it('should ensure all mapped lead types are valid database values', () => {
      const coverageTypes = [
        'term-life',
        'whole-life',
        'iul',
        'mortgage-protection',
        'final-expense',
        'not-sure',
      ];

      const validLeadTypes = [
        'mortgage_protection',
        'term',
        'whole_life',
        'universal',
        'final_expense',
      ];

      coverageTypes.forEach((coverage) => {
        const leadType = mapCoverageTypeToLeadType(coverage);
        expect(validLeadTypes).toContain(leadType);
      });
    });
  });

  describe('Database Constraint Compliance', () => {
    it('should only use status values that match database constraint', () => {
      const databaseStatuses = [
        'new',
        'contacted',
        'qualified',
        'converted',
        'lost',
        'closed',
        'not_interested',
      ];

      // Verify our validation matches database
      databaseStatuses.forEach((status) => {
        const { error } = leadUpdateValidationSchema.validate({ status });
        expect(error).toBeUndefined();
      });
    });

    it('should only map to lead_type values that match database constraint', () => {
      const databaseLeadTypes = [
        'mortgage_protection',
        'term',
        'whole_life',
        'universal',
        'final_expense',
      ];

      const allCoverageTypes = [
        'term-life',
        'whole-life',
        'iul',
        'mortgage-protection',
        'final-expense',
        'not-sure',
      ];

      allCoverageTypes.forEach((coverage) => {
        const mappedLeadType = mapCoverageTypeToLeadType(coverage);
        expect(databaseLeadTypes).toContain(mappedLeadType);
      });
    });
  });
});
