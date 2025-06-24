import { Client } from 'discord.js';

interface ExtendedClient extends Client {
  commands: any;
}

export default {
  once: true,

  /**
   * @param client Discord Client
   */
  async run(client: ExtendedClient) {
    console.log(`Logged in as ${client.user!.tag}`);

    const slashCommandData = client.commands.map((v: any) => v.slash);
    await client.application!.commands.set(slashCommandData);
  },
}; 