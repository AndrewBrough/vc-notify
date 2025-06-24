import { EmbedBuilder, Message, TextChannel } from 'discord.js';

/**
 * Send a message with embeds to a text channel.
 */
export async function sendEmbedMessage(channel: TextChannel, embed: EmbedBuilder): Promise<Message> {
  return channel.send({ embeds: [embed] });
}

/**
 * Edit a message with a new embed.
 */
export async function updateEmbedMessage(message: Message, embed: EmbedBuilder): Promise<Message> {
  return message.edit({ embeds: [embed] });
}

/**
 * Find the latest embed message sent by a specific user in a channel.
 */
export async function findLatestEmbedByUser(channel: TextChannel, userId: string, limit = 20): Promise<Message | undefined> {
  const messages = await channel.messages.fetch({ limit });
  return messages.find(msg => msg.author.id === userId && msg.embeds.length > 0);
} 