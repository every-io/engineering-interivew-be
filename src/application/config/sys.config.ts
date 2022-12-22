import { ENV } from 'config-decorators';

export class SysConfig {
  @ENV('APP_NAME', true)
  public name!: string;
}
