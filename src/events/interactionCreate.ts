import { ChatInputCommandInteraction, Events, Interaction } from 'discord.js';
import changeVcNotifyRole from '../commands/changeVcNotifyRole';
import { ExtendedClient } from '../types';

const commands: Record<
  string,
  { execute: (interaction: ChatInputCommandInteraction) => Promise<any> }
> = {
  'change-vc-notify-role': changeVcNotifyRole,
};

export default {
  name: Events.InteractionCreate,
  async execute(_client: ExtendedClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = commands[interaction.commandName];
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  },
};
