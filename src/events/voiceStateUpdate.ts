import { Events, VoiceState } from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import {
  buildDescriptionFromUserLines,
  buildSessionEmbed,
  getNotifyRoleMention,
  makeJoinOrLeaveLine,
  parseUserLines,
  updateUserLine
} from '../discord/embeds';
import { findLatestEmbedByUser, sendEmbedMessage, updateEmbedMessage } from '../discord/messages';

// Main event handler for voice state updates
export default {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return;

    const voiceChannel = newState.channel || oldState.channel;
    if (!voiceChannel) return;

    const textChannel = getVoiceChannelTextChat(voiceChannel);
    if (!textChannel) return;

    // Find the latest session embed sent by the bot
    const lastSessionMsg = await findLatestEmbedByUser(textChannel, textChannel.client.user!.id);

    // Determine join/leave
    const joined = !!newState.channel && !oldState.channel;
    const left = !!oldState.channel && !newState.channel;
    const now = new Date();

    // Handle join event
    if (joined) {
      // Check if the channel was empty before this user joined
      const otherMembers = newState.channel!.members.filter(m => m.id !== newState.id && !m.user.bot);
      const channelWasEmpty = otherMembers.size === 0;
      if (channelWasEmpty) {
        // Get the notify role mention for this guild
        const roleMention = getNotifyRoleMention(voiceChannel.guild);
        // Start a new session: send a new embed message
        const description = makeJoinOrLeaveLine(member.id, now, 'join');
        const embed = buildSessionEmbed(voiceChannel.name, description, roleMention);
        await sendEmbedMessage(textChannel, embed);
        return;
      }
    }

    // Parse and update user lines in the description
    let userLines = parseUserLines(lastSessionMsg?.embeds[0]?.description);
    if (joined) {
      userLines = updateUserLine(userLines, member.id, now, 'join');
    } else if (left) {
      userLines = updateUserLine(userLines, member.id, now, 'leave');
    }
    const description = buildDescriptionFromUserLines(userLines);

    // Always update the last session message (never send a new one unless starting a new session)
    if (lastSessionMsg) {
      const embed = buildSessionEmbed(voiceChannel.name, description);
      await updateEmbedMessage(lastSessionMsg, embed);
    }
  },
}; 