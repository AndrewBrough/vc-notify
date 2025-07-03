import { Events, Guild } from 'discord.js';
import { logError } from '../utils/errorHandling';

const executeGuildUnavailable = async (guild: Guild): Promise<void> => {
  try {
    console.log(`⚠️ Guild ${guild.name} became unavailable`);
    
    // When a guild becomes unavailable, we should note this for potential state issues
    // The guild will likely become available again, but there might be missed events
    console.log(`📝 Guild ${guild.name} unavailable - potential for missed voice state events`);
    
  } catch (error) {
    logError('guild unavailable', error);
  }
};

export const guildUnavailableEvent = {
  name: Events.GuildUnavailable,
  execute: executeGuildUnavailable,
}; 