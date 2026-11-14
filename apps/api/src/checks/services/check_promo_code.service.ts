// Path: apps/api/src/checks/services/check_promo_code.service.ts

import { Discount_Extraction } from '../schemas/discount_extraction.schema.js';
import { Promo_Code_Check } from '../types/promo_code.types.js';

export function check_promo_code(
  promo_code: Discount_Extraction['promo_code'],
  expected_code: string,
): Promo_Code_Check {
  const { state, value, evidence } = promo_code;

//   console.log('promo_rule_input', { state, value, evidence, expected_code });

  const result: Promo_Code_Check = {
    field: 'promo_code',
    status: 'REVIEW',
    code: 'PROMO_CODE_UNCLEAR',
    expected: expected_code,
    observed: null,
    evidence: evidence?.trim() || null,
  };

  if (state === 'absent' && value === null && result.evidence === null) {
    return {
      ...result,
      status: 'FAIL',
      code: 'REQUIRED_VALUE_MISSING',
    };
  }

  if (state !== 'readable' || !value?.trim() || !result.evidence) {
    return result;
  }

  const matches = value === expected_code;

  return {
    ...result,
    status: matches ? 'PASS' : 'FAIL',
    code: matches ? 'MATCH' : 'PROMO_CODE_MISMATCH',
    observed: value,
  };
}
