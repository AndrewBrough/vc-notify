import { EmbedBuilder } from 'discord.js';

export function formatDiscordTimestamp(date: Date): string {
  // Only show the time (e.g., 7:36 PM)
  return `<t:${Math.floor(date.getTime() / 1000)}:t>`;
}

export function makeJoinOrLeaveLine(memberId: string, time: Date, type: 'join' | 'leave') {
  const emoji = type === 'join' ? '💚' : '💔';
  return `<@${memberId}> ${emoji} ${formatDiscordTimestamp(time)}`;
}

export function parseUserLines(description: string | null | undefined): Record<string, string> {
  // Returns a map of user mention to line
  if (!description) return {};
  const lines = description.split('\n');
  const map: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(/^<@\d+>/);
    if (match) {
      map[match[0]] = line;
    }
  }
  return map;
}

export function updateUserLine(
  userLines: Record<string, string>,
  memberId: string,
  time: Date,
  type: 'join' | 'leave'
): Record<string, string> {
  userLines[`<@${memberId}>`] = makeJoinOrLeaveLine(memberId, time, type);
  return userLines;
}

export function buildDescriptionFromUserLines(userLines: Record<string, string>): string {
  return Object.values(userLines).join('\n');
}

export function buildSessionEmbed(channelName: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setDescription(description);
} 