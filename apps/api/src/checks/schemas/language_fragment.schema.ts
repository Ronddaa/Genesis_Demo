// Path: apps/api/src/checks/schemas/language_fragment.schema.ts

export const language_fragment_schema = {
  type: 'object',
  additionalProperties: false,
  required: ['text', 'role', 'language'],
  properties: {
    text: {
      type: 'string',
      description:
        'Copy the visible text of this fragment exactly, preserving its original language.',
    },
    role: {
      type: 'string',
      enum: ['headline', 'button', 'offer', 'caption', 'other'],
      description: 'The function of this fragment on the banner.',
    },
    language: {
      type: ['string', 'null'],
      description:
        'Use a lowercase two-letter language code when identifiable. Use null when the language cannot be determined from the visible text.',
    },
  },
} as const;