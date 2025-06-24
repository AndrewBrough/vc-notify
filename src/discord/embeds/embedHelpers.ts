import { EmbedBuilder } from 'discord.js';

export function formatDiscordTimestamp(date: Date): string {
  return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}

export function makeJoinField(memberId: string, joinTime: Date) {
  return {
    name: 'is here! Joined at:',
    value: `<@${memberId}> • ${formatDiscordTimestamp(joinTime)}`,
    inline: false,
  };
}

export function makeLeaveField(memberId: string, leaveTime: Date) {
  return {
    name: 'left at:',
    value: `<@${memberId}> • ${formatDiscordTimestamp(leaveTime)}`,
    inline: false,
  };
}

export function buildSessionEmbed(channelName: string, fields: { name: string; value: string; inline: boolean }[]): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setFields(fields);
} 