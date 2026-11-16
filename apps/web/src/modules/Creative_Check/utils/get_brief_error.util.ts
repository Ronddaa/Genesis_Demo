// Path: apps/web/src/modules/Creative_Check/utils/get_brief_error.util.ts

import type { Check_Brief } from "../types/check_api.type";

export function get_brief_error(brief: Check_Brief): string | null {
  const language = brief.language?.trim();
  const discount_percent = brief.discount_percent?.trim();
  const promo_code = brief.promo_code?.trim();

  if (!language && !discount_percent && !promo_code) {
    return "Set at least one requirement in the campaign brief.";
  }

  if (language && language.length > 64) {
    return "The language must be 64 characters or fewer.";
  }

  if (discount_percent && !/^(?:[1-9][0-9]?|100)$/.test(discount_percent)) {
    return "The discount must be a whole number from 1 to 100.";
  }

  if (promo_code && promo_code.length > 128) {
    return "The promo code must be 128 characters or fewer.";
  }

  return null;
}