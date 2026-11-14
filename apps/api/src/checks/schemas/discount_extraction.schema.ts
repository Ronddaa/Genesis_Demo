// Path: apps/api/src/checks/schemas/discount_extraction.schema.ts

import type { FromSchema } from 'json-schema-to-ts';

export const discount_extraction_schema = {
  type: 'object',
  additionalProperties: false,
  required: ['extracted_text', 'offers', 'offer_presence'],
  properties: {
    extracted_text: {
      type: 'string',
      description:
        'Transcribe visible advertising text in its original language. Preserve line breaks. Never reconstruct hidden characters.',
    },
    offers: {
      type: 'array',
      description:
        'List each distinct discount offer once. Include partially readable offers. Return an empty array if no discount offer is visible. Exclude ordinary prices, product sizes and delivery times.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['evidence', 'value', 'unit', 'condition', 'readability'],
        properties: {
          evidence: {
            type: 'string',
            description:
              'Copy the visible words and symbols supporting this offer, including any qualifier such as "up to".',
          },
          value: {
            type: ['number', 'null'],
            description:
              'The numeric discount amount. Use null if the full number cannot be read.',
          },
          unit: {
            type: 'string',
            enum: ['percent', 'money', 'unknown'],
          },
          condition: {
            type: 'string',
            enum: ['exact', 'up_to', 'from', 'other', 'unknown'],
            description:
              'Use exact for a fixed discount, up_to for a maximum, from for a minimum, other for another visible condition, and unknown when unclear.',
          },
          readability: {
            type: 'string',
            enum: ['readable', 'partial', 'unreadable'],
            description:
              'Assess whether the amount, unit and qualifying terms of this offer can be read.',
          },
        },
      },
    },
    offer_presence: {
      type: 'string',
      enum: ['present', 'absent', 'uncertain'],
      description: [
        'Use present when a discount offer is visible, even if its amount is hidden.',
        'Use absent only when the advertising content is readable and contains no discount offer.',
        'Use uncertain when obscured or unreadable content prevents determining whether an offer exists.',
      ].join(' '),
    },
  },
} as const;

export type Discount_Extraction = FromSchema<typeof discount_extraction_schema>;
