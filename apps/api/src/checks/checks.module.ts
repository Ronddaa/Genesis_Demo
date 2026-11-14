import { Module } from '@nestjs/common';
import { Checks_Controller } from './checks.controller.js';
import { Gemini_Reader_Service } from './services/gemini_reader.service.js';
import { Checks_Service } from './checks.service.js';

@Module({
  controllers: [Checks_Controller],
  providers: [Checks_Service, Gemini_Reader_Service],
})
export class Checks_Module {}