import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { errorEmbed, readJSON, successEmbed, writeJSON } from '../utils/functions';

export default {
  slash: new SlashCommandBuilder()
    .setName('set_announcement_channel')
    .setDescription('Sets the VC announcement channel to #channel')
    .addChannelOption(channel =>
      channel
        .setName('channel')
        .setDescription('The channel to announce new VC sessions in')
        .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(_client: any, interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel', true) as TextChannel;

    const missingPermissions: string[] = [];
    const channelPerms = channel.permissionsFor(interaction.guild!.members.me!);

    if (!channelPerms.has(PermissionFlagsBits.ViewChannel)) missingPermissions.push('View Channel');
    if (!channelPerms.has(PermissionFlagsBits.SendMessages)) missingPermissions.push('Send Messages');
    if (!channelPerms.has(PermissionFlagsBits.MentionEveryone)) missingPermissions.push('Mention @everyone');

    if (missingPermissions.length > 0) {
      const embed = errorEmbed().setDescription(
        `The bot is missing the following permissions for ${channel}: ${missingPermissions.map(v => `\`${v}\``).join(', ')}`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Initialize guild data if it doesn't exist
    if (!readJSON('./data/guild.json')[interaction.guild!.id]) {
      writeJSON('./data/guild.json', interaction.guild!.id, {});
    }

    writeJSON('./data/guild.json', `${interaction.guild!.id}.announcement_channel`, channel.id);

    const embed = successEmbed().setDescription(`Successfully set the VC announcement channel to ${channel}.`);
    return interaction.reply({ embeds: [embed] });
  },
}; 