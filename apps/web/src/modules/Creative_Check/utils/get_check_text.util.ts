// Path: apps/web/src/modules/Creative_Check/utils/get_check_text.util.ts

import type { Field_Check } from "../types/check_api.type";

const field_titles: Record<Field_Check["field"], string> = {
  discount_percent: "Discount",
  language: "Language",
  promo_code: "Promo Code",
};

const code_messages = new Map<string, string>([
  ["MATCH", "Matches the brief."],
  [
    "DISCOUNT_VALUE_MISMATCH",
    "The discount on the banner differs from the brief.",
  ],
  [
    "DISCOUNT_CONDITION_MISMATCH",
    "The banner says “up to” or “from”, but the brief requires an exact discount.",
  ],
  [
    "DISCOUNT_UNIT_MISMATCH",
    "The discount is given as money, but the brief requires a percentage.",
  ],
  [
    "DISCOUNT_UNCLEAR",
    "The discount could not be read reliably. A person should check it.",
  ],
  [
    "MULTIPLE_DISCOUNT_LINES",
    "The banner shows more than one discount. A person should check it.",
  ],
  ["REQUIRED_VALUE_MISSING", "The required value is missing from the banner."],
  [
    "LANGUAGE_MISMATCH",
    "Some text on the banner is not in the required language.",
  ],
  [
    "LANGUAGE_UNCLEAR",
    "The language of some text could not be determined. A person should check it.",
  ],
  [
    "BRIEF_LANGUAGE_UNCLEAR",
    "The language in the brief is unclear. Specify exactly one language.",
  ],
  [
    "PROMO_CODE_MISMATCH",
    "The promo code on the banner differs from the brief.",
  ],
  [
    "PROMO_CODE_UNCLEAR",
    "The promo code could not be read reliably. A person should check it.",
  ],
]);

export function get_field_title(field: Field_Check["field"]): string {
  return field_titles[field];
}

export function get_code_message(code: string): string {
  return code_messages.get(code) ?? code;
}
