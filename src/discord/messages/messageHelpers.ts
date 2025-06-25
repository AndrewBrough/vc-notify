import { EmbedBuilder, Message, TextChannel } from 'discord.js';

/**
 * Send a message with embeds to a text channel.
 */
export async function sendEmbedMessage(
  channel: TextChannel,
  embed: EmbedBuilder
): Promise<Message> {
  return channel.send({ embeds: [embed] });
}

/**
 * Edit a message with a new embed.
 */
export async function updateEmbedMessage(
  message: Message,
  embed: EmbedBuilder
): Promise<Message> {
  return message.edit({ embeds: [embed] });
}

/**
 * Find the latest embed message sent by a specific user in a channel.
 */
export async function findLatestEmbedByUser(
  channel: TextChannel,
  userId: string,
  limit = 20
): Promise<Message | undefined> {
  try {
    const messages = await channel.messages.fetch({ limit });
    return messages.find(
      (msg) => msg.author.id === userId && msg.embeds.length > 0
    );
  } catch (error) {
    // Handle permission errors gracefully
    if (error instanceof Error && 'code' in error && error.code === 50001) {
      console.log(
        `Missing permission to read message history in channel #${channel.name} (${channel.id})`
      );
      return undefined;
    }
    // Re-throw other errors
    throw error;
  }
}
