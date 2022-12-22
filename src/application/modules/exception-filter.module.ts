import { Module } from '@nestjs/common';
import { UnhandledExceptionsFilter } from '../exception-filter/unhandled-exceptions.filter';

@Module({
  providers: [UnhandledExceptionsFilter],
  exports: [UnhandledExceptionsFilter],
})
export class ExceptionFilterModule {}
