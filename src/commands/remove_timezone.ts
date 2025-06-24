import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorEmbed, readJSON, successEmbed, writeJSON } from '../utils/functions';

export default {
  slash: new SlashCommandBuilder()
    .setName('remove_timezone')
    .setDescription('Remove the custom timezone setting (revert to default)')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(_client: any, interaction: ChatInputCommandInteraction) {
    const data = readJSON('./data/guild.json')[interaction.guild!.id];

    if (!data?.timezone) {
      const embed = errorEmbed().setDescription('This server doesn\'t have a custom timezone setup.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    writeJSON('./data/guild.json', `${interaction.guild!.id}.timezone`, null);

    const embed = successEmbed().setDescription(
      `Successfully removed the custom timezone setting.\nThe timezone was previously set to: ${data.timezone}`
    );
    return interaction.reply({ embeds: [embed] });
  },
}; 