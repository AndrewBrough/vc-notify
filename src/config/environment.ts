interface BotConfig {
  token: string;
  clientId: string;
  name: string;
  inviteLink: string;
}

interface EnvironmentConfig {
  bot: BotConfig;
  dataDirectory: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

const getBotConfig = (): BotConfig => {
  const env = getEnvironment();

  if (env === 'test') {
    return {
      token: process.env.DISCORD_BOT_TOKEN_TEST || '',
      clientId: process.env.DISCORD_CLIENT_ID_TEST || '',
      name: 'VC Notify Test Bot',
      inviteLink: process.env.DISCORD_INVITE_LINK_TEST || '',
    };
  }

  // Default/production config
  return {
    token: process.env.DISCORD_BOT_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '1347826239804538894',
    name: 'VC Notify Bot',
    inviteLink:
      process.env.DISCORD_INVITE_LINK ||
      'https://discord.com/oauth2/authorize?client_id=1347826239804538894&permissions=397553134592&integration_type=0&scope=bot+applications.commands',
  };
};

const getDataDirectory = (): string => {
  const env = getEnvironment();
  return env === 'test' ? './data-test' : './data';
};

const getLogLevel = (): 'debug' | 'info' | 'warn' | 'error' => {
  const env = getEnvironment();
  return (process.env.LOG_LEVEL as any) || (env === 'test' ? 'debug' : 'info');
};

export const config: EnvironmentConfig = {
  bot: getBotConfig(),
  dataDirectory: getDataDirectory(),
  logLevel: getLogLevel(),
};

export const isTestEnvironment = (): boolean => {
  return getEnvironment() === 'test';
};

export const isDevelopmentEnvironment = (): boolean => {
  return getEnvironment() === 'development';
};

export const isProductionEnvironment = (): boolean => {
  return getEnvironment() === 'production';
};
