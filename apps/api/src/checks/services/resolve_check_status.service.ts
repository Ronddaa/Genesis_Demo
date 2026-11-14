// Path: apps/api/src/checks/services/resolve_check_status.service.ts

type Check_Status = 'PASS' | 'FAIL' | 'REVIEW';

export function resolve_check_status(
  checks: ReadonlyArray<{ status: Check_Status }>,
): Check_Status {
  if (checks.length === 0) {
    throw new Error('Cannot resolve banner status without field checks.');
  }

  if (checks.some((check) => check.status === 'FAIL')) {
    return 'FAIL';
  }

  if (checks.some((check) => check.status === 'REVIEW')) {
    return 'REVIEW';
  }

  return 'PASS';
}