// Path: apps/api/src/checks/checks.service.ts

import { Injectable } from '@nestjs/common';
import { Gemini_Reader_Service } from './services/gemini_reader.service.js';
import { Create_Check_DTO } from './dto/create_check.dto.js';
import { inspect_image } from './services/inspect_image.service.js';
import { Discount_Check } from './types/discount.types.js';
import { Language_Check } from './types/language.type.js';
import { check_language } from './services/check_language.service.js';
import { check_discount } from './services/check_discount.service.js';
import { check_promo_code } from './services/check_promo_code.service.js';
import { Promo_Code_Check } from './types/promo_code.types.js';
import { resolve_check_status } from './services/resolve_check_status.service.js';

@Injectable()
export class Checks_Service {
  constructor(private readonly gemini_reader: Gemini_Reader_Service) {}

  async create_check(brief: Create_Check_DTO, image_buffer: Buffer) {
    const image_info = await inspect_image(image_buffer);
    const mime_type = image_info.format === 'png' ? 'image/png' : 'image/jpeg';

    const extraction = await this.gemini_reader.read_discount(
      image_buffer,
      mime_type,
      brief.language,
    );

    const checks: Array<Discount_Check | Language_Check | Promo_Code_Check> =
      [];

    if (brief.discount_percent !== undefined) {
      checks.push(check_discount(extraction, Number(brief.discount_percent)));
    }

    if (brief.language !== undefined) {
      if (extraction.expected_language_code === null) {
        checks.push({
          field: 'language',
          status: 'REVIEW',
          code: 'BRIEF_LANGUAGE_UNCLEAR',
          expected: brief.language,
          observed: null,
          evidence: null,
          location: null,
          findings: [],
          message: 'Please specify one language to check in the brief.',
        });
      } else {
        checks.push(
          check_language(
            extraction.language_fragments,
            extraction.expected_language_code,
          ),
        );
      }
    }

    if (brief.promo_code !== undefined) {
      checks.push(check_promo_code(extraction.promo_code, brief.promo_code));
    }

    return {
      image_id: brief.image_id,
      processing_status: 'completed' as const,
      status: resolve_check_status(checks),
      file_size_bytes: image_buffer.length,
      image: image_info,
      extracted_text: extraction.extracted_text,
      checks,
    };
  }
}
