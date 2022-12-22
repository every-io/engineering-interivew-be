import { loadConfig } from 'config-decorators';
import { Environment } from './environment';
import { SysConfig } from './sys.config';

export class AppConfig {
  public readonly env = Environment.get();

  public readonly app = loadConfig(SysConfig);
}
