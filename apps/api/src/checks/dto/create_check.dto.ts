// Path: apps/api/src/checks/dto/create_check.dto.ts

import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import normalize_optional_text_util from '../../utils/normalaize_optional_text.util.js';

export class Create_Check_DTO {
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{1,64}$/, {
    message:
      'image_id must contain 1–64 letters, digits, underscores or hyphens',
  })
  image_id!: string;

  @Transform(({ value }) => normalize_optional_text_util(value))
  @IsOptional()
  @IsString()
  @MaxLength(64, {
    message: 'language must be at most 64 characters long',
  })
  language?: string;

  @Transform(({ value }) => normalize_optional_text_util(value))
  @IsOptional()
  @IsString()
  @Matches(/^(?:[1-9][0-9]?|100)$/, {
    message: 'discount_percent must be a whole number from 1 to 100',
  })
  discount_percent?: string;

  @Transform(({ value }) => normalize_optional_text_util(value))
  @IsOptional()
  @IsString()
  @MaxLength(128)
  promo_code?: string;
}
