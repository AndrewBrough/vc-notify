import { Events } from 'discord.js';
import { ExtendedClient } from '../types';

export default {
  name: Events.ClientReady,
  once: true,

  /**
   * @param client Discord Client
   */
  async execute(client: ExtendedClient) {
    console.log(`Logged in as ${client.user!.tag}`);
    // No commands to register since we removed all commands
  },
};
