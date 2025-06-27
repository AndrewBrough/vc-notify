import { Events } from 'discord.js';
import { config } from '../config/environment';
import { ExtendedClient } from '../types';
import { registerCommands } from '../utils/commandRegistration';
import { logError } from '../utils/errorHandling';

const executeReady = async (client: ExtendedClient): Promise<void> => {
  console.log(`🤖 Logged in as ${client.user!.tag} (${config.bot.name})\n`);

  // Register slash commands
  if (client.user) {
    try {
      await registerCommands();
    } catch (error) {
      logError('command registration on ready', error);
    }
  }

  console.log('\n=== Bot Invite Link ===');
  console.log(`Use this link to invite ${config.bot.name} to your server:`);
  console.log(config.bot.inviteLink);
  console.log('\n=== Environment Info ===');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data Directory: ${config.dataDirectory}`);
  console.log(`Log Level: ${config.logLevel}`);
};

export const readyEvent = {
  name: Events.ClientReady,
  once: true,
  execute: executeReady,
};
