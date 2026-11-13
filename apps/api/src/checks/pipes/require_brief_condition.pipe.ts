// Path: apps/api/src/checks/pipes/require_brief_condition.pipe.ts

import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Create_Check_DTO } from '../dto/create_check.dto.js';

@Injectable()
export class Require_Brief_Condition_Pipe implements PipeTransform<
  Create_Check_DTO,
  Create_Check_DTO
> {
  transform(brief: Create_Check_DTO): Create_Check_DTO {
    const { language, discount_percent, promo_code } = brief;

    if (!language && !discount_percent && !promo_code) {
      throw new UnprocessableEntityException({
        code: 'EMPTY_BRIEF',
        message: 'Specify the language, discount, or promo code to check.',
      });
    }

    return brief;
  }
}
