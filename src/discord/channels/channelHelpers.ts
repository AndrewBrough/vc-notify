import { ChannelType, Guild, TextChannel, VoiceBasedChannel } from 'discord.js';

/**
 * Get a text channel by ID from a guild.
 */
export function getTextChannel(
  guild: Guild,
  channelId: string
): TextChannel | null {
  const channel = guild.channels.cache.get(channelId);
  if (channel && channel.type === ChannelType.GuildText) {
    return channel as TextChannel;
  }
  return null;
}

/**
 * Get a voice channel by ID from a guild.
 */
export function getVoiceChannel(
  guild: Guild,
  channelId: string
): VoiceBasedChannel | null {
  const channel = guild.channels.cache.get(channelId);
  if (
    channel &&
    (channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice)
  ) {
    return channel as VoiceBasedChannel;
  }
  return null;
}

/**
 * Get the associated text chat for a voice channel (by ID).
 */
export function getVoiceChannelTextChat(
  voiceChannel: VoiceBasedChannel
): TextChannel | null {
  if (!voiceChannel || !voiceChannel.guild) return null;
  const textChannel = voiceChannel.guild.channels.cache.get(voiceChannel.id);
  if (textChannel && textChannel.isTextBased()) {
    return textChannel as TextChannel;
  }
  return null;
}
