import { Client, Events } from 'discord.js';
import { registerCommands } from '../utils/commandRegistration';
import { logError } from '../utils/errorHandling';
import { startPeriodicValidation } from '../utils/periodicValidation';

const executeReady = async (client: Client): Promise<void> => {
  console.log(`🤖 Logged in as ${client.user!.tag}`);

  // Register slash commands
  if (client.user) {
    try {
      await registerCommands();
    } catch (error) {
      logError('command registration on ready', error);
    }
  }

  // Start periodic validation
  startPeriodicValidation(client);

  console.log('============== 🔗 BOT INVITE LINK ==============');
  console.log(import.meta.env.DISCORD_INVITE_LINK);
};

export const readyEvent = {
  name: Events.ClientReady,
  once: true,
  execute: executeReady,
};
