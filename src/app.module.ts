import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from './application/config/config.module';
import { Environment } from './application/config/environment';
import { ExceptionFilterModule } from './application/modules/exception-filter.module';
import { LoginModule } from './application/modules/login.module';
import { TaskModule } from './application/modules/task.module';

@Module({
  imports: [
    ConfigModule,
    ExceptionFilterModule,
    TaskModule,
    LoginModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  private readonly WAIT_MS_BEFORE_SHUTDOWN = 15_000;

  public constructor() {}

  // This will be called when application is shutting down. The idea is to wait a while
  // before proceeding with the shutdown, to give Kubernetes some time to properly stop
  // sending traffic to this host and therefore avoid downtime.
  public async onModuleDestroy(): Promise<void> {
    if (!Environment.isDevelopment()) {
      await new Promise((resolve) => setTimeout(resolve, this.WAIT_MS_BEFORE_SHUTDOWN));    
    }
  }
}
