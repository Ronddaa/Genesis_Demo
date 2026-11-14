import { parseArgs } from 'node:util';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const { values } = parseArgs({
    options: {
      host: { type: 'string' },
      port: { type: 'string' },
    },
  });

  const host = values.host ?? process.env.HOST;
  const port = Number(values.port ?? process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Invalid application port.');
  }

  const app = await NestFactory.create(AppModule);

  if (host) {
    await app.listen(port, host);
  } else {
    await app.listen(port);
  }
}

await bootstrap();