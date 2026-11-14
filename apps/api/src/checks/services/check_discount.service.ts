// Path: apps/api/src/checks/services/check_discount.service.ts

import { Discount_Extraction } from '../schemas/discount_extraction.schema.js';
import { Discount_Check } from '../types/discount.types.js';

export function check_discuont(
  extraction: Discount_Extraction,
  expected_percent: number,
): Discount_Check {
  const { offers, offer_presence } = extraction;

  console.log('discount_rule_input', {
    offer_presence,
    offers_count: offers.length
  });
  

  const result: Discount_Check = {
    field: 'discount_percent',
    status: 'REVIEW',
    code: 'DISCOUNT_UNCLEAR',
    expected: `${expected_percent}%`,
    observed: null,
    evidence: null,
  };

  if (offer_presence === 'absent' && offers.length === 0) {
    return {
      ...result,
      status: 'FAIL',
      code: 'REQUIRED_VALUE_MISSING',
    };
  }

  if (offer_presence !== 'present') {
    return result;
  }

  if (offers.length > 1) {
    return {
      ...result,
      code: 'MULTIPLE_DISCOUNT_LINES',
      evidence: offers.map((offer) => offer.evidence).join('\n'),
    };
  }

  const [offer] = offers;
  if (!offer) return result;

  result.evidence = offer.evidence.trim() || null;

  if (
    !result ||
    offer.readability !== 'readable' ||
    offer.value === null ||
    offer.unit === 'unknown'
  ) {
    return result;
  }

  if (offer.unit === 'money') {
    return {
      ...result,
      status: 'FAIL',
      code: 'DISCOUNT_UNIT_MISMATCH',
      observed: offer.evidence,
    };
  }

  if (offer.condition === 'up_to' || offer.condition === 'from') {
    return {
      ...result,
      status: 'FAIL',
      code: 'DISCOUNT_CONDITION_MISMATCH',
      observed: offer.evidence,
    };
  }

  if (offer.condition !== 'exact') return result;

  const matches = offer.value === expected_percent;

  return {
    ...result,
    status: matches ? 'PASS' : 'FAIL',
    code: matches ? 'MATCH' : 'DISCOUNT_VALUE_MISMATCH',
    observed: `${offer.value}%`,
  };
}
