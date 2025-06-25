import { EmbedBuilder, Message } from 'discord.js';

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

export function buildSessionEmbed(channelName: string, description: string, roleMention?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}${roleMention ? ' ' + roleMention : ''}`)
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
  return !!(message.author?.bot && 
         message.embeds?.length > 0 && 
         message.embeds[0]?.title?.includes('joined'));
}

export function createVoiceJoinEmbed(memberId: string, channelName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setFields([
      { name: memberId, value: `is here!` }
    ]);
}

export function createSecondaryJoinEmbed(memberId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x747f8d)
    .setDescription(`<@${memberId}> is here`);
} 