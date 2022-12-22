import { ENV, loadConfig } from 'config-decorators';

class EnvDefinition {
  @ENV('ENVIRONMENT', true)
  public readonly env!: 'development' | 'staging' | 'production';
}

export class Environment {
  private static readonly currentEnv = loadConfig(EnvDefinition).env;

  public static get(): 'development' | 'staging' | 'production' {
    return this.currentEnv;
  }

  public static isDevelopment(): boolean {
    return this.currentEnv === 'development';
  }

  public static isStaging(): boolean {
    return this.currentEnv === 'staging';
  }

  public static isProduction(): boolean {
    return this.currentEnv === 'production';
  }
}
