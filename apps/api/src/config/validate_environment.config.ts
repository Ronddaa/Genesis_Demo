// Path: apps/api/src/config/validate_environment.config.ts

const required_variables = ['GEMINI_API_KEY', 'GEMINI_MODEL'] as const;

export function validate_environment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const validated_environment = { ...environment };

  for (const variable_name of required_variables) {
    const value = environment[variable_name];

    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing environment variable: ${variable_name}`);
    }

    validated_environment[variable_name] = value.trim();
  }

  return validated_environment;
}
