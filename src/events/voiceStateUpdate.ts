import { Events, VoiceState } from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import { buildSessionEmbed, makeJoinField, makeLeaveField } from '../discord/embeds';
import { findLatestEmbedByUser, sendEmbedMessage, updateEmbedMessage } from '../discord/messages';
import { isSessionExpired } from '../discord/voiceState';

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
    const expired = isSessionExpired(lastSessionMsg);

    // Determine join/leave
    const joined = !!newState.channel && !oldState.channel;
    const left = !!oldState.channel && !newState.channel;

    // Handle join event
    if (joined) {
      // Check if the channel was empty before this user joined
      const otherMembers = newState.channel!.members.filter(m => m.id !== newState.id && !m.user.bot);
      const channelWasEmpty = otherMembers.size === 0;
      if (channelWasEmpty) {
        // Start a new session: send a new embed message
        const fields = [makeJoinField(member.id, new Date())];
        const embed = buildSessionEmbed(voiceChannel.name, fields);
        await sendEmbedMessage(textChannel, embed);
        return;
      }
    }

    // Build or update embed fields for join/leave
    const fields = (lastSessionMsg?.embeds[0]?.fields?.map(f => ({ name: f.name, value: f.value, inline: f.inline ?? false })) || []);
    if (joined) {
      fields.push(makeJoinField(member.id, new Date()));
    } else if (left) {
      fields.push(makeLeaveField(member.id, new Date()));
    }

    // Create or update embed
    const embed = buildSessionEmbed(voiceChannel.name, fields);
    if (expired || !lastSessionMsg) {
      await sendEmbedMessage(textChannel, embed);
    } else {
      await updateEmbedMessage(lastSessionMsg, embed);
    }
  },
}; 