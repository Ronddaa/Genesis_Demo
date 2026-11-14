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
import { FileInterceptor } from '@nestjs/platform-express';
import type {} from 'multer';
import { Create_Check_DTO } from './dto/create_check.dto.js';
import { Require_Brief_Condition_Pipe } from './pipes/require_brief_condition.pipe.js';
import { Checks_Service } from './checks.service.js';

@Controller('checks')
export class Checks_Controller {
  constructor(private readonly checks_service: Checks_Service) {}

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
  create_check(
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

    return this.checks_service.create_check(brief, image.buffer);
  }
}