// Path: apps/api/src/checks/services/check_language.service.ts

import type {
  Language_Check,
  Language_Fragment,
} from '../types/language.type.js';

export function check_language(
  fragments: Language_Fragment[],
  expected_language: string,
): Language_Check {
  const result: Language_Check = {
    field: 'language',
    status: 'REVIEW',
    code: 'LANGUAGE_UNCLEAR',
    expected: expected_language,
    observed: null,
    evidence: null,
    location: null,
    findings: [],
  };

  if (fragments.length === 0) {
    return result;
  }

  const findings: Language_Check['findings'] = [];

  for (const fragment of fragments) {
    const evidence = fragment.text.trim();
    const language = fragment.language;

    const observed =
      evidence && language && /^[a-z]{2}$/.test(language) ? language : null;

    if (observed !== expected_language) {
      findings.push({
        location: fragment.role,
        observed,
        evidence,
      });
    }
  }

  const [first_finding] = findings;

  if (!first_finding) {
    return {
      ...result,
      status: 'PASS',
      code: 'MATCH',
      observed: expected_language,
    };
  }

  const mismatch = findings.find((finding) => finding.observed !== null);
  const primary = mismatch ?? first_finding;

  return {
    ...result,
    status: mismatch ? 'FAIL' : 'REVIEW',
    code: mismatch ? 'LANGUAGE_MISMATCH' : 'LANGUAGE_UNCLEAR',
    observed: primary.observed,
    evidence: primary.evidence || null,
    location: primary.location,
    findings,
  };
}
