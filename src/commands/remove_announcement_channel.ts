import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorEmbed, readJSON, successEmbed, writeJSON } from '../utils/functions';

export default {
  slash: new SlashCommandBuilder()
    .setName('remove_announcement_channel')
    .setDescription('Removes the announcement channel data')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(_client: any, interaction: ChatInputCommandInteraction) {
    const data = readJSON('./data/guild.json')[interaction.guild!.id];

    if (!data?.announcement_channel) {
      const embed = errorEmbed().setDescription('This server doesn\'t have an announcement channel setup.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    writeJSON('./data/guild.json', `${interaction.guild!.id}.announcement_channel`, null);

    const embed = successEmbed().setDescription(
      `Successfully removed the VC announcement channel data.\nThe VC announcement channel was previously <#${data.announcement_channel}>.`
    );
    return interaction.reply({ embeds: [embed] });
  },
}; 