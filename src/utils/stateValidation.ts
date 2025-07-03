import { Guild, VoiceBasedChannel } from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import { parseUserLines } from '../discord/embeds';
import { findLatestEmbedByUser } from '../discord/messages';

export interface StateValidationResult {
  channel: VoiceBasedChannel;
  textChannel: string | null;
  hasSessionMessage: boolean;
  actualMembers: string[];
  recordedMembers: string[];
  missingMembers: string[];
  extraMembers: string[];
  isConsistent: boolean;
  issues: string[];
}

export const validateVoiceChannelState = async (
  guild: Guild,
  voiceChannel: VoiceBasedChannel
): Promise<StateValidationResult> => {
  const result: StateValidationResult = {
    channel: voiceChannel,
    textChannel: null,
    hasSessionMessage: false,
    actualMembers: [],
    recordedMembers: [],
    missingMembers: [],
    extraMembers: [],
    isConsistent: true,
    issues: [],
  };

  try {
    // Get associated text channel
    const textChannel = getVoiceChannelTextChat(voiceChannel);
    if (textChannel) {
      result.textChannel = textChannel.name;
    } else {
      result.issues.push('No associated text channel found');
      result.isConsistent = false;
    }

    // Get actual members in voice channel
    const nonBotMembers = voiceChannel.members.filter(m => !m.user.bot);
    result.actualMembers = Array.from(nonBotMembers.keys());

    // Get recorded members from session message
    if (textChannel) {
      const lastSessionMsg = await findLatestEmbedByUser(
        textChannel,
        guild.client.user!.id
      );

      if (lastSessionMsg) {
        result.hasSessionMessage = true;
        const userLines = parseUserLines(lastSessionMsg.embeds[0]?.description);
        result.recordedMembers = Object.keys(userLines);

        // Find inconsistencies
        result.missingMembers = result.actualMembers.filter(
          memberId => !result.recordedMembers.includes(memberId)
        );
        result.extraMembers = result.recordedMembers.filter(
          memberId => !result.actualMembers.includes(memberId)
        );

        if (result.missingMembers.length > 0) {
          result.issues.push(`Missing members: ${result.missingMembers.length}`);
          result.isConsistent = false;
        }

        if (result.extraMembers.length > 0) {
          result.issues.push(`Extra members: ${result.extraMembers.length}`);
          result.isConsistent = false;
        }
      } else {
        if (result.actualMembers.length > 0) {
          result.issues.push('No session message found but members are present');
          result.isConsistent = false;
        }
      }
    }

    // Additional validation checks
    if (result.actualMembers.length === 0 && result.hasSessionMessage) {
      result.issues.push('Channel is empty but has session message');
      result.isConsistent = false;
    }

  } catch (error) {
    result.issues.push(`Error during validation: ${error}`);
    result.isConsistent = false;
  }

  return result;
};

export const validateAllVoiceChannels = async (guild: Guild): Promise<StateValidationResult[]> => {
  const voiceChannels = guild.channels.cache.filter(
    channel => channel.isVoiceBased()
  ) as Map<string, VoiceBasedChannel>;

  const results: StateValidationResult[] = [];
  
  for (const [_, channel] of voiceChannels) {
    const result = await validateVoiceChannelState(guild, channel);
    results.push(result);
  }

  return results;
};

export const logStateValidation = (results: StateValidationResult[]): void => {
  console.log('\n🔍 Voice Channel State Validation Results:');
  console.log('==========================================');
  
  let totalIssues = 0;
  
  for (const result of results) {
    console.log(`\n📢 Channel: ${result.channel.name}`);
    console.log(`   Text Channel: ${result.textChannel || 'None'}`);
    console.log(`   Session Message: ${result.hasSessionMessage ? 'Yes' : 'No'}`);
    console.log(`   Actual Members: ${result.actualMembers.length}`);
    console.log(`   Recorded Members: ${result.recordedMembers.length}`);
    
    if (result.issues.length > 0) {
      console.log(`   ❌ Issues: ${result.issues.join(', ')}`);
      totalIssues += result.issues.length;
    } else {
      console.log(`   ✅ Consistent`);
    }
    
    if (result.missingMembers.length > 0) {
      console.log(`   🔍 Missing: ${result.missingMembers.length} members`);
    }
    
    if (result.extraMembers.length > 0) {
      console.log(`   🔍 Extra: ${result.extraMembers.length} members`);
    }
  }
  
  console.log(`\n📊 Summary: ${totalIssues} total issues found across ${results.length} channels`);
}; 