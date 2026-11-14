// Path: apps/api/src/checks/schemas/parse_discount_extraction.schema.ts

import { BadGatewayException } from '@nestjs/common';
import { Ajv } from 'ajv';
import {
  discount_extraction_schema,
  type Discount_Extraction,
} from './discount_extraction.schema.js';

const validator = new Ajv();
const validate_extraction = validator.compile<Discount_Extraction>(
  discount_extraction_schema,
);

function invalid_provider_response() {
  return new BadGatewayException({
    code: 'INVALID_PROVIDER_RESPONSE',
    message: 'The provider returned an invalid discount extraction.',
  });
}

export function parse_discount_extraction(text: string): Discount_Extraction {
  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    throw invalid_provider_response();
  }

  if (!validate_extraction(payload)) {
    throw invalid_provider_response();
  }

  return payload;
}
