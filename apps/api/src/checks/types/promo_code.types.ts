// Path: apps/api/src/checks/types/promo_code.types.ts

export interface Promo_Code_Check {
  field: 'promo_code';
  status: 'PASS' | 'FAIL' | 'REVIEW';
  code:
    | 'MATCH'
    | 'PROMO_CODE_MISMATCH'
    | 'REQUIRED_VALUE_MISSING'
    | 'PROMO_CODE_UNCLEAR';
  expected: string;
  observed: string | null;
  evidence: string | null;
}