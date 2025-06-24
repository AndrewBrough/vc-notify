import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorEmbed, readJSON, successEmbed, writeJSON } from '../utils/functions';

export default {
  slash: new SlashCommandBuilder()
    .setName('remove_private_channel')
    .setDescription('Removes the private announcement channel data (Admin only)')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run(_client: any, interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = errorEmbed().setDescription('You need Administrator permissions to use this command.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const data = readJSON('./data/guild.json')[interaction.guild!.id];

    if (!data?.private_announcement_channel) {
      const embed = errorEmbed().setDescription('This server doesn\'t have a private announcement channel setup.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    writeJSON('./data/guild.json', `${interaction.guild!.id}.private_announcement_channel`, null);

    const embed = successEmbed().setDescription(
      `Successfully removed the private VC announcement channel data.\nThe private VC announcement channel was previously <#${data.private_announcement_channel}>.`
    );
    return interaction.reply({ embeds: [embed] });
  },
}; 