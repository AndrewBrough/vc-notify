const { Client, VoiceState, PermissionFlagsBits } = require("discord.js");
const { readJSON, successEmbed, millisecondsToSeconds } = require("../functions");

const activeVoiceSessions = new Map(); // Store message IDs for each channel
const sessionData = new Map(); // Store session data (starter and start time)
const memberJoinTimes = new Map(); // Store member join times for each channel

/**
 * Checks if a channel is private (not visible to @everyone)
 * @param {VoiceChannel} channel - The voice channel to check
 * @returns {boolean} Whether the channel is private
 */
function isPrivateChannel(channel) {
  if (!channel) return false;
  const everyoneRole = channel.guild.roles.everyone;
  return !channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel);
}

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

    // Skip if either the old or new channel is private
    if (isPrivateChannel(oldState.channel) || isPrivateChannel(newState.channel)) {
      return;
    }

    // Handle member leaving
    if (oldState.channel) {
      const channelMembers = memberJoinTimes.get(oldState.channel.id) || new Map();
      const memberJoinTime = channelMembers.get(oldState.member.id);
      const duration = memberJoinTime ? now - memberJoinTime : 0;
      channelMembers.delete(oldState.member.id);
      
      if (oldState.channel.members.size === 0) {
        // Last person left, update or finalize the message
        const lastMember = oldState.member.displayName;
        const sessionInfo = sessionData.get(oldState.channel.id) || { starter: "Unknown", startTime: now };
        const sessionDuration = now - sessionInfo.startTime;
        memberJoinTimes.delete(oldState.channel.id); // Clear member data for this channel
        
        return updateOrSendMessage(oldState.channel.id, channel, {
          title: "Voice Channel Session Ended",
          description: `${oldState.channel} | Session Duration: ${formatDuration(sessionDuration)}`,
          fields: [
            { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
            { name: "Last Member", value: `${lastMember}\nLeft: <t:${millisecondsToSeconds(now)}:f>\nTime spent: ${formatDuration(duration)}` }
          ],
          content: `Voice session ended in ${oldState.channel.name}`
        }, true);
      } else {
        // Update the message to show the member left
        const sessionInfo = sessionData.get(oldState.channel.id);
        if (sessionInfo) {
          const membersWithTimes = formatMemberList(oldState.channel.members, channelMembers, now);
          await updateOrSendMessage(oldState.channel.id, channel, {
            title: `${oldState.member.displayName} left the ${oldState.channel}`,
            description: `${oldState.channel} | Member left after ${formatDuration(duration)}`,
            fields: [
              { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
              { name: "Current Members", value: membersWithTimes || "No members" }
            ],
            content: `${oldState.member.displayName} left ${oldState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
          });
        }
      }
    }

    // Handle member joining
    if (newState.channel) {
      let channelMembers = memberJoinTimes.get(newState.channel.id) || new Map();
      channelMembers.set(newState.member.id, now);
      memberJoinTimes.set(newState.channel.id, channelMembers);

      // Format member list with join times and durations
      const membersWithTimes = formatMemberList(newState.channel.members, channelMembers, now);

      if (newState.channel.members.size === 1) {
        // First person joined, create a new embed
        sessionData.set(newState.channel.id, { starter: firstMember, startTime: now });
        const sentMessage = await updateOrSendMessage(newState.channel.id, channel, {
          title: `${firstMember} started a new voice session`,
          description: `${newState.channel} | Session started <t:${millisecondsToSeconds(now)}:R>`,
          fields: [
            { name: "Started By", value: `${firstMember}\nStarted: <t:${millisecondsToSeconds(now)}:f>` },
            { name: "Current Members", value: membersWithTimes }
          ],
          content: `${newState.member.displayName} started a voice session in ${newState.channel.name}`
        });
        activeVoiceSessions.set(newState.channel.id, sentMessage.id);
      } else {
        // Update the existing embed when more users join
        const sessionInfo = sessionData.get(newState.channel.id) || { starter: firstMember, startTime: now };
        const sessionDuration = now - sessionInfo.startTime;
        await updateOrSendMessage(newState.channel.id, channel, {
          title: `${newState.member.displayName} joined the voice session`,
          description: `${newState.channel} | Session duration: ${formatDuration(sessionDuration)}`,
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
 * Formats a duration in milliseconds to a human-readable string
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
function formatDuration(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Formats the member list with join times and durations
 * @param {Collection} members - Channel members collection
 * @param {Map} joinTimes - Map of member join times
 * @param {number} now - Current timestamp
 * @returns {string} Formatted member list
 */
function formatMemberList(members, joinTimes, now) {
  return Array.from(members.values())
    .map(member => {
      const joinTime = joinTimes.get(member.id);
      if (!joinTime) return `${member.displayName} (join time unknown)`;
      const duration = now - joinTime;
      return `${member.displayName} (joined <t:${millisecondsToSeconds(joinTime)}:R>)`;
    })
    .join("\n");
}

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
