import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { UnhandledExceptionsFilter } from './application/exception-filter/unhandled-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const exceptionFilter = app.get(UnhandledExceptionsFilter);

  app.useGlobalFilters(exceptionFilter);
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.use(
    helmet.hsts({
      maxAge: 31536000,
      preload: true,
    }),
  );

  app.use(
    helmet.referrerPolicy({
      policy: 'no-referrer-when-downgrade',
    }),
  );

  // Enable shutdown hooks to have a graceful shutdown
  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
