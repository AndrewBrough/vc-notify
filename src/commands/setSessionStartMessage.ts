import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logError, sendErrorResponse } from '../utils/errorHandling';
import { setSessionStartMessage } from '../utils/sessionMessages';

const setSessionStartMessageData = new SlashCommandBuilder()
  .setName('set-session-start-message')
  .setDescription(
    'Set the session start message. Use @role and #channel for mentions.'
  )
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription(
        'Custom message (Discord mentions like @role and #channel are supported)'
      )
      .setRequired(true)
      .setMaxLength(200)
  );

const updateSessionStartMessage = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const message = interaction.options.getString('message', true);

  setSessionStartMessage(interaction.guild!.id, message);

  await interaction.reply({
    content: `✅ Session start message set to:\n${message}\n(Mentions will work as in normal Discord messages.)`,
    ephemeral: true,
  });
};

const executeSetSessionStartMessage = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  if (!interaction.guild) return;

  try {
    await updateSessionStartMessage(interaction);
  } catch (error) {
    logError('set-session-start-message command', error);
    await sendErrorResponse(interaction);
  }
};

export const setSessionStartMessageCommand = {
  data: setSessionStartMessageData,
  execute: executeSetSessionStartMessage,
};
