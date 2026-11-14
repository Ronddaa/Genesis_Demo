// Path: apps/api/src/checks/types/language.type.ts

import type { Discount_Extraction } from '../schemas/discount_extraction.schema.js';

export type Language_Fragment = Discount_Extraction['language_fragments'][number];

interface Language_Finding {
  location: Language_Fragment['role'];
  observed: string | null;
  evidence: string;
}

export interface Language_Check {
  field: 'language';
  status: 'PASS' | 'FAIL' | 'REVIEW';
  code: 'MATCH' | 'LANGUAGE_MISMATCH' | 'LANGUAGE_UNCLEAR';
  expected: string;
  observed: string | null;
  evidence: string | null;
  location: Language_Fragment['role'] | null;
  findings: Language_Finding[];
}
