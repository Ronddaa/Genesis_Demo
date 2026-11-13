// Path: apps/api/src/utils/normalaize_optional_text.util.ts

export default function normalize_optional_text_util(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const value_trim = value.trim();
  return value_trim.length > 0 ? value_trim : undefined;
}
