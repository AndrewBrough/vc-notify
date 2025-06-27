import { Client, Events } from 'discord.js';
import { registerCommands } from '../utils/commandRegistration';
import { logError } from '../utils/errorHandling';

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

  console.log('============== 🔗 BOT INVITE LINK ==============');
  console.log(import.meta.env.DISCORD_INVITE_LINK);
};

export const readyEvent = {
  name: Events.ClientReady,
  once: true,
  execute: executeReady,
};
