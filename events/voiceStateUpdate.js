const { Client, VoiceState, PermissionFlagsBits } = require("discord.js");
const { readJSON } = require("../functions");

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

/**
 * Checks if there was an actual channel change
 * @param {VoiceState} oldState - The old voice state
 * @param {VoiceState} newState - The new voice state
 * @returns {boolean} Whether there was a channel change
 */
function isChannelChange(oldState, newState) {
  return oldState.channelId !== newState.channelId;
}

/**
 * Handles voice state updates for public channels
 * @param {VoiceState} oldState - The old voice state
 * @param {VoiceState} newState - The new voice state
 * @param {TextChannel} announcementChannel - The channel to send announcements to
 */
async function handlePublicChannelUpdate(oldState, newState, announcementChannel) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    await announcementChannel.send(
      `${newState.member.displayName} joined ${newState.channel.name} at ${joinTime}`
    );
  }
}

/**
 * Handles voice state updates for private channels
 * @param {VoiceState} oldState - The old voice state
 * @param {VoiceState} newState - The new voice state
 * @param {TextChannel} announcementChannel - The channel to send announcements to
 */
async function handlePrivateChannelUpdate(oldState, newState, announcementChannel) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    await announcementChannel.send(
      `${newState.member.displayName} joined private ${newState.channel.name} at ${joinTime}`
    );
  }
}

module.exports = {
  once: false,

  /**
   * @param {Client} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  async run(client, oldState, newState) {
    // Only proceed if there was an actual channel change
    if (!isChannelChange(oldState, newState)) {
      return;
    }

    const guildData = readJSON("./data/guild.json")[newState.guild?.id || oldState.guild?.id];
    if (!guildData) return;

    // Get the appropriate announcement channel based on channel type
    const channel = newState.channel || oldState.channel;
    const isPrivate = isPrivateChannel(channel);
    const announcementChannelId = isPrivate ? guildData.private_announcement_channel : guildData.announcement_channel;
    
    if (!announcementChannelId) return;
    
    try {
      const announcementChannel = await (newState.guild || oldState.guild).channels.fetch(announcementChannelId);
      if (!announcementChannel) return;

      // Handle the update based on channel type
      if (isPrivate) {
        await handlePrivateChannelUpdate(oldState, newState, announcementChannel);
      } else {
        await handlePublicChannelUpdate(oldState, newState, announcementChannel);
      }
    } catch (error) {
      console.error("Error handling voice state update:", error);
    }
  }
};
