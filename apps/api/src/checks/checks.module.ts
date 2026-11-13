import { Module } from '@nestjs/common';
import { Checks_Controller } from './checks.controller.js';
import { Gemini_Reader_Service } from './services/gemini_reader.service.js';

@Module({
  controllers: [Checks_Controller],
  providers: [Gemini_Reader_Service],
})
export class Checks_Module {}