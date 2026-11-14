// Path: apps/api/src/checks/types/discount.types.ts

type Discount_Status = 'PASS' | 'FAIL' | 'REVIEW';

type Discount_Code =
  | 'MATCH'
  | 'DISCOUNT_VALUE_MISMATCH'
  | 'DISCOUNT_CONDITION_MISMATCH'
  | 'DISCOUNT_UNIT_MISMATCH'
  | 'DISCOUNT_UNCLEAR'
  | 'MULTIPLE_DISCOUNT_LINES'
  | 'REQUIRED_VALUE_MISSING';

export interface Discount_Check {
  field: 'discount_percent';
  status: Discount_Status;
  code: Discount_Code;
  expected: string;
  observed: string | null;
  evidence: string | null;
}
