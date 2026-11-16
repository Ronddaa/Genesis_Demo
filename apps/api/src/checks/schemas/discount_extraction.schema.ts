// Path: apps/api/src/checks/schemas/discount_extraction.schema.ts

import type { FromSchema } from 'json-schema-to-ts';
import { language_fragment_schema } from './language_fragment.schema.js';

export const discount_extraction_schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'extracted_text',
    'offers',
    'offer_presence',
    'expected_language_code',
    'language_fragments',
    'promo_code',
  ],
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
        'Use absent only when the advertising content is readable and no discount offer appears.',
        'Use uncertain when obscured or unreadable content prevents determining whether a discount claim exists.',
      ].join(' '),
    },
    expected_language_code: {
      type: ['string', 'null'],
      pattern: '^[a-z]{2}$',
      description: [
        'Resolve the supplied brief_language to one lowercase ISO 639-1 code.',
        'Use only brief_language for this field. Never infer it from the image.',
        'Accept a language name in any language, a valid code, or an obvious misspelling with one clear interpretation.',
        'Return null for missing, ambiguous, conflicting or unrecognizable input, or if the language has no ISO 639-1 code.',
      ].join(' '),
    },
    language_fragments: {
      type: 'array',
      description: [
        'Extract each visible advertising text fragment, including short buttons and captions.',
        'Split fragments when the language changes.',
        'Identify each fragment from its own visible wording independently of brief_language.',
        'Exclude standalone promo codes, URLs, brand names, numbers and measurement units.',
        'Keep ordinary words beside those values, such as the label before a promo code.',
        'Return an empty array if there is no visible advertising wording to assess.',
      ].join(' '),
      items: language_fragment_schema,
    },
    promo_code: {
      type: 'object',
      additionalProperties: false,
      required: ['state', 'value', 'evidence'],
      properties: {
        state: {
          type: 'string',
          enum: ['readable', 'absent', 'partial', 'unreadable', 'uncertain'],
          description: [
            'Use readable when one promo code is fully visible.',
            'Use absent when the advertising content is readable and no promo code appears.',
            'Use partial when only some code characters are visible.',
            'Use unreadable when a code is visibly present but its characters cannot be read.',
            'Use uncertain when presence is unclear or several possible codes appear.',
          ].join(' '),
        },
        value: {
          type: ['string', 'null'],
          description: [
            'For readable, copy only the complete code exactly as printed.',
            'Preserve case, digits, repeated letters, punctuation and accents.',
            'For every other state, return null.',
          ].join(' '),
        },
        evidence: {
          type: ['string', 'null'],
          description: [
            'Copy the visible fragment that identifies the code, including its label when present.',
            'Mark obscured characters as [unreadable]. Use null if no supporting text is visible.',
          ].join(' '),
        },
      },
    },
  },
} as const;

export type Discount_Extraction = FromSchema<typeof discount_extraction_schema>;