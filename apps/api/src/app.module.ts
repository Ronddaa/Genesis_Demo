import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { validate_environment } from './config/validate_environment.config.js';
import { Checks_Module } from './checks/checks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate_environment,
    }),
    Checks_Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
