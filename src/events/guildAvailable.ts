import { Events, Guild } from 'discord.js';
import { logError } from '../utils/errorHandling';
import { runImmediateValidation } from '../utils/periodicValidation';

const executeGuildAvailable = async (guild: Guild): Promise<void> => {
  try {
    console.log(`✅ Guild ${guild.name} became available again`);
    
    // After a guild becomes available, run immediate validation to check for any state inconsistencies
    // that might have occurred during the outage
    console.log(`🔍 Running immediate validation for ${guild.name} after availability restoration`);
    await runImmediateValidation(guild);
    
  } catch (error) {
    logError('guild available', error);
  }
};

export const guildAvailableEvent = {
  name: Events.GuildAvailable,
  execute: executeGuildAvailable,
}; 