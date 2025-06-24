import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorEmbed, formatTime, readJSON, successEmbed, writeJSON } from '../utils/functions';

// Common timezone options
const TIMEZONE_OPTIONS = [
  { name: 'Eastern Time (ET)', value: 'America/New_York' },
  { name: 'Central Time (CT)', value: 'America/Chicago' },
  { name: 'Mountain Time (MT)', value: 'America/Denver' },
  { name: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { name: 'UTC', value: 'UTC' },
  { name: 'London (GMT)', value: 'Europe/London' },
  { name: 'Paris (CET)', value: 'Europe/Paris' },
  { name: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { name: 'Sydney (AEDT)', value: 'Australia/Sydney' },
];

export default {
  slash: new SlashCommandBuilder()
    .setName('set_timezone')
    .setDescription('Set the timezone for voice channel announcements')
    .addStringOption(option =>
      option
        .setName('timezone')
        .setDescription('The timezone for announcements')
        .setRequired(true)
        .addChoices(...TIMEZONE_OPTIONS)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(_client: any, interaction: ChatInputCommandInteraction) {
    const timezone = interaction.options.getString('timezone', true);

    // Test the timezone to make sure it's valid
    try {
      formatTime(new Date(), timezone);
    } catch (error) {
      const embed = errorEmbed().setDescription(`Invalid timezone: ${timezone}`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Initialize guild data if it doesn't exist
    if (!readJSON('./data/guild.json')[interaction.guild!.id]) {
      writeJSON('./data/guild.json', interaction.guild!.id, {});
    }

    writeJSON('./data/guild.json', `${interaction.guild!.id}.timezone`, timezone);

    const embed = successEmbed().setDescription(
      `Successfully set the timezone to ${timezone}.\nCurrent time: ${formatTime(new Date(), timezone)}`
    );
    return interaction.reply({ embeds: [embed] });
  },
}; 