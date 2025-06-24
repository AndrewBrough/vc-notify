import { EmbedBuilder } from 'discord.js';

export function formatDiscordTimestamp(date: Date): string {
  // Only show the time (e.g., 7:36 PM)
  return `<t:${Math.floor(date.getTime() / 1000)}:t>`;
}

export function makeJoinOrLeaveField(memberId: string, displayName: string, time: Date, type: 'join' | 'leave') {
  const emoji = type === 'join' ? '💚' : '💔';
  return {
    name: displayName,
    value: `<@${memberId}> ${emoji} ${formatDiscordTimestamp(time)}`,
    inline: false,
  };
}

export function buildSessionEmbed(channelName: string, fields: { name: string; value: string; inline: boolean }[]): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setFields(fields);
} 