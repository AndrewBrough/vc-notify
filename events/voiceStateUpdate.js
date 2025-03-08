const { Client, VoiceState } = require("discord.js");
const { readJSON, successEmbed, millisecondsToSeconds } = require("../functions");

const activeVoiceSessions = new Map(); // Store message IDs for each channel
const sessionData = new Map(); // Store session data (starter and start time)

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
    const members = voiceChannel?.members.map(v => v.displayName).join(", ") || "";
    const firstMember = voiceChannel?.members.first()?.displayName || "Unknown";

    if (oldState.channel && !newState.channel && oldState.channel.members.size === 0) {
      // Last person left, update or finalize the message
      const lastMember = oldState.member.displayName;
      const sessionInfo = sessionData.get(oldState.channel.id) || { starter: "Unknown", startTime: now };
      return updateOrSendMessage(oldState.channel.id, channel, {
        title: "Voice Channel Session Ended",
        description: `${oldState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
        fields: [
          { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
          { name: "Last Member", value: `${lastMember}\nLeft: <t:${millisecondsToSeconds(now)}:f>` }
        ],
        content: `Voice session ended in ${oldState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
      }, true);
    }

    if (newState.channel?.members.size === 1) {
      // First person joined, create a new embed
      sessionData.set(newState.channel.id, { starter: firstMember, startTime: now }); // Store who started the session and when
      const sentMessage = await updateOrSendMessage(newState.channel.id, channel, {
        title: "Someone joined a voice channel!",
        description: `${newState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
        fields: [
          { name: "Started By", value: `${firstMember}\nStarted: <t:${millisecondsToSeconds(now)}:f>` },
          { name: "Current Members", value: members }
        ],
        content: `${newState.member.displayName} joined ${newState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
      });
      activeVoiceSessions.set(newState.channel.id, sentMessage.id);
    } else if (newState.channel?.members.size > 1) {
      // Update the existing embed when more users join
      const sessionInfo = sessionData.get(newState.channel.id) || { starter: firstMember, startTime: now };
      await updateOrSendMessage(newState.channel.id, channel, {
        title: "Someone joined a voice channel!",
        description: `${newState.channel} | <t:${millisecondsToSeconds(now)}:R>`,
        fields: [
          { name: "Started By", value: `${sessionInfo.starter}\nStarted: <t:${millisecondsToSeconds(sessionInfo.startTime)}:f>` },
          { name: "Current Members", value: members }
        ],
        content: `Someone joined ${newState.channel.name} | <t:${millisecondsToSeconds(now)}:R>`
      });
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
