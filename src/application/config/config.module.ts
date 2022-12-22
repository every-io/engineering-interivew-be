import { Module, Provider } from '@nestjs/common';
import { loadConfig } from 'config-decorators';
import { AppConfig } from './app.config';

const configProvider: Provider = {
  provide: AppConfig,
  useValue: loadConfig(AppConfig),
};

@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigModule {}
