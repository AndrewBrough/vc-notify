import { ChatInputCommandInteraction } from 'discord.js';

/**
 * Sends an error response to a Discord interaction
 */
export const sendErrorResponse = async (
  interaction: ChatInputCommandInteraction,
  message: string = 'There was an error while executing this command!'
): Promise<void> => {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ content: message, ephemeral: true });
  } else {
    await interaction.reply({ content: message, ephemeral: true });
  }
};

/**
 * Logs an error with context and optional custom message
 */
export const logError = (
  context: string,
  error: unknown,
  customMessage?: string
): void => {
  const message = customMessage || 'An error occurred';
  console.error(`${message} in ${context}:`, error);
};
