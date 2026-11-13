// Path: apps/api/src/checks/checks.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import type {} from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Require_Brief_Condition_Pipe } from './pipes/require_brief_condition.pipe.js';
import { Create_Check_DTO } from './dto/create_check.dto.js';
import { inspect_image } from './services/inspect_image.service.js';
import { Gemini_Reader_Service } from './services/gemini_reader.service.js';

@Controller('checks')
export class Checks_Controller {
  constructor(private readonly gemini_reader: Gemini_Reader_Service) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024,
        fields: 4,
        fieldSize: 1024,
        parts: 6,
      },
    }),
  )
  async create_check(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
      new Require_Brief_Condition_Pipe(),
    )
    brief: Create_Check_DTO,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (!image || image.size === 0) {
      throw new UnprocessableEntityException({
        code: 'IMAGE_REQUIRED',
        message: 'Add minimum one or not empty file.',
      });
    }

    const image_info = await inspect_image(image.buffer);
    const mime_type = image_info.format === 'png' ? 'image/png' : 'image/jpeg';

    const extracted_text = await this.gemini_reader.read_text(
      image.buffer,
      mime_type,
    );

    return {
      image_id: brief.image_id,
      processing_status: 'completed',
      file_size_bytes: image.size,
      image: image_info,
      extracted_text,
    };
  }
}
