import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data/sessionStartMessages.json';

function readMessageMap(): Record<string, string> {
  if (!existsSync(DATA_FILE)) return {};
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeMessageMap(map: Record<string, string>) {
  writeFileSync(DATA_FILE, JSON.stringify(map, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('set-session-start-message')
    .setDescription(
      'Set the custom message for session start. Supports {channel} and {role} placeholders.'
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription(
          'Custom message (use {channel} and {role} for placeholders)'
        )
        .setRequired(true)
        .setMaxLength(200)
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) return;
    const message = interaction.options.getString('message', true);
    const map = readMessageMap();
    map[interaction.guild.id] = message;
    writeMessageMap(map);
    await interaction.reply({
      content: `✅ Session start message set to:\n${message}`,
      ephemeral: true,
    });
  },
};
