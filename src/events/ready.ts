import { Events } from 'discord.js';
import { ExtendedClient } from '../types';
import { registerCommands } from '../utils/commandRegistration';

const INVITE_LINK =
  'https://discord.com/oauth2/authorize?client_id=1347826239804538894&permissions=397553134592&integration_type=0&scope=bot+applications.commands';

export default {
  name: Events.ClientReady,
  once: true,

  /**
   * @param client Discord Client
   */
  async execute(client: ExtendedClient) {
    console.log(`Logged in as ${client.user!.tag}\n`);

    // Register slash commands
    if (client.user) {
      await registerCommands(client.user.id, process.env.DISCORD_BOT_TOKEN!);
    }

    console.log('\n=== Bot Invite Link ===');
    console.log('Use this link to invite the bot to your server:');
    console.log(INVITE_LINK);
  },
};
