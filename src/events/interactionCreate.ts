import { ChatInputCommandInteraction, Client, Interaction } from 'discord.js';

async function slashCommandHandler(client: Client, interaction: ChatInputCommandInteraction) {
  const command = (client as any).commands.get(interaction.commandName);
  command.run(client, interaction);
}

export default {
  once: false,

  async run(client: Client, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      slashCommandHandler(client, interaction as ChatInputCommandInteraction);
    }
  },
}; 