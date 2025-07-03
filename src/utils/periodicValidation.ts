import { Client, Guild } from 'discord.js';
import { logError } from './errorHandling';
import { logStateValidation, validateAllVoiceChannels } from './stateValidation';

const VALIDATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let validationInterval: NodeJS.Timeout | null = null;

export const startPeriodicValidation = (client: Client): void => {
  if (validationInterval) {
    clearInterval(validationInterval);
  }

  validationInterval = setInterval(async () => {
    try {
      console.log('\n🔄 Running periodic voice state validation...');
      
      for (const [guildId, guild] of client.guilds.cache) {
        try {
          const results = await validateAllVoiceChannels(guild);
          const inconsistentChannels = results.filter(result => !result.isConsistent);
          
          if (inconsistentChannels.length > 0) {
            console.log(`⚠️ Guild ${guild.name} has ${inconsistentChannels.length} inconsistent channels`);
            logStateValidation(results);
          } else {
            console.log(`✅ Guild ${guild.name}: All channels consistent`);
          }
        } catch (error) {
          logError(`periodic validation for guild ${guild.name}`, error);
        }
      }
    } catch (error) {
      logError('periodic validation', error);
    }
  }, VALIDATION_INTERVAL_MS);

  console.log(`🔄 Periodic validation started (interval: ${VALIDATION_INTERVAL_MS / 1000}s)`);
};

export const stopPeriodicValidation = (): void => {
  if (validationInterval) {
    clearInterval(validationInterval);
    validationInterval = null;
    console.log('🔄 Periodic validation stopped');
  }
};

export const runImmediateValidation = async (guild: Guild): Promise<void> => {
  try {
    console.log(`🔍 Running immediate validation for guild ${guild.name}...`);
    const results = await validateAllVoiceChannels(guild);
    logStateValidation(results);
  } catch (error) {
    logError(`immediate validation for guild ${guild.name}`, error);
  }
}; 