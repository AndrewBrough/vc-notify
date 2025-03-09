const { Client, VoiceState } = require("discord.js");
const { readJSON, successEmbed, millisecondsToSeconds } = require("../functions");

const activeVoiceSessions = new Map(); // Store message IDs for each channel
const sessionData = new Map(); // Store session data (starter and start time)
const memberJoinTimes = new Map(); // Store member join times for each channel

module.exports = {
  once: false,

  /**
   * @param {Client} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  async run(client, oldState, newState) {
    const now = Date.now();
    const guildData = readJSON("./data/guild.json")[newState.guild?.id || oldState.guild?.id];
    if (!guildData?.announcement_channel) return;

    const channel = await (newState.guild || oldState.guild).channels.fetch(guildData.announcement_channel);
    const voiceChannel = newState.channel || oldState.channel;
    const firstMember = voiceChannel?.members.first()?.displayName || "Unknown";

    // Handle member leaving
    if (oldState.channel) {
      const channelMembers = memberJoinTimes.get(oldState.channel.id) || new Map();
      channelMembers.delete(oldState.member.id);
      
      if (oldState.channel.members.size === 0) {
        // Last person left, update or finalize the message
        const lastMember = oldState.member.displayName;
        const sessionInfo = sessionData.get(oldState.channel.id) || { starter: "Unknown", startTime: now };
        memberJoinTimes.delete(oldState.channel.id); // Clear member data for this channel
        return updateOrSendMessage(oldState.channel.id, channel, {
          title: "Voice Channel Session Ended",
          description: `${oldState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
          fields: [
            { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
            { name: "Last Member", value: `${lastMember}\nLeft: <t:${millisecondsToSeconds(now)}:f>` }
          ],
          content: `Voice session ended in ${oldState.channel.name}`
        }, true);
      }
    }

    // Handle member joining
    if (newState.channel) {
      let channelMembers = memberJoinTimes.get(newState.channel.id) || new Map();
      channelMembers.set(newState.member.id, now);
      memberJoinTimes.set(newState.channel.id, channelMembers);

      // Format member list with join times
      const membersWithTimes = Array.from(channelMembers.entries())
        .map(([memberId, joinTime]) => {
          const member = newState.channel.members.get(memberId);
          return `${member.displayName} (joined <t:${millisecondsToSeconds(joinTime)}:R>)`;
        })
        .join("\n");

      if (newState.channel.members.size === 1) {
        // First person joined, create a new embed
        sessionData.set(newState.channel.id, { starter: firstMember, startTime: now });
        const sentMessage = await updateOrSendMessage(newState.channel.id, channel, {
          title: `${firstMember} joined the ${newState.channel}`,
          description: `${newState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
          fields: [
            { name: "Started By", value: `${firstMember}\nStarted: <t:${millisecondsToSeconds(now)}:f>` },
            { name: "Current Members", value: membersWithTimes }
          ],
          content: `${newState.member.displayName} joined ${newState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
        });
        activeVoiceSessions.set(newState.channel.id, sentMessage.id);
      } else if (newState.channel.members.size > 1) {
        // Update the existing embed when more users join
        const sessionInfo = sessionData.get(newState.channel.id) || { starter: firstMember, startTime: now };
        await updateOrSendMessage(newState.channel.id, channel, {
          title: `${newState.member.displayName} joined the ${newState.channel}`,
          description: `${newState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
          fields: [
            { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
            { name: "Current Members", value: membersWithTimes }
          ],
          content: `${newState.member.displayName} joined ${newState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
        });
      }
    }
  }
};

/**
 * Updates an existing message or sends a new one if none exists.
 * @param {string} channelId - The voice channel ID
 * @param {TextChannel} announcementChannel - The text channel to send the message in
 * @param {Object} embedData - The embed content
 * @param {boolean} [finalize=false] - Whether to delete the stored message ID
 */
async function updateOrSendMessage(channelId, announcementChannel, embedData, finalize = false) {
  const embed = successEmbed()
    .setTitle(embedData.title)
    .setDescription(embedData.description);
  embedData.fields.forEach(field => embed.addFields(field));

  try {
    if (activeVoiceSessions.has(channelId)) {
      const message = await announcementChannel.messages.fetch(activeVoiceSessions.get(channelId));
      if (message) {
        await message.edit({ content: embedData.content, embeds: [embed] });
        if (finalize) activeVoiceSessions.delete(channelId);
        return message;
      }
    }
  } catch (error) {
    console.error("Error updating message:", error);
  }

  const newMessage = await announcementChannel.send({ content: embedData.content, embeds: [embed] });
  return newMessage;
}
