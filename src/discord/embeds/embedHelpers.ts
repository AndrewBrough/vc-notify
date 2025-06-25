import { EmbedBuilder, Message } from 'discord.js';

export function formatDiscordTimestamp(date: Date): string {
  // Only show the time (e.g., 7:36 PM)
  return `<t:${Math.floor(date.getTime() / 1000)}:t>`;
}

export function makeJoinOrLeaveLine(
  memberId: string,
  time: Date,
  type: 'join' | 'leave'
) {
  const emoji = type === 'join' ? '💚' : '💔';
  return `<@${memberId}> ${emoji} ${formatDiscordTimestamp(time)}`;
}

export function parseUserLines(
  description: string | null | undefined
): Record<string, string> {
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
  const key = `<@${memberId}>`;
  if (type === 'join') {
    // On join, always reset to a new join line
    userLines[key] = makeJoinOrLeaveLine(memberId, time, 'join');
  } else {
    // On leave, if there is a join line, convert it to a range
    const prevLine = userLines[key];
    const joinMatch = prevLine?.match(/<t:(\d+):t>/);
    if (joinMatch) {
      const joinTimestamp = Number(joinMatch[1]) * 1000;
      const joinDate = new Date(joinTimestamp);
      userLines[key] =
        `<@${memberId}> 💔 ${formatDiscordTimestamp(joinDate)} - ${formatDiscordTimestamp(time)}`;
    } else {
      // If no join line, just show leave
      userLines[key] = makeJoinOrLeaveLine(memberId, time, 'leave');
    }
  }
  return userLines;
}

export function buildDescriptionFromUserLines(
  userLines: Record<string, string>
): string {
  const userLinesText = Object.values(userLines).join('\n');

  return userLinesText;
}

export function buildSessionEmbed(
  channelName: string,
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setDescription(description);
}

export function successEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0x57f287);
}

export function errorEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0xed4245);
}

export function isVcNotifyMessage(message: Message): boolean {
  // Check if this is a vc-notify message by looking for our embed pattern
  return !!(
    message.author?.bot &&
    message.embeds?.length > 0 &&
    message.embeds[0]?.title?.includes('joined')
  );
}
