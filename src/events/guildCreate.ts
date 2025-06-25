import { Events, Guild } from 'discord.js';

export default {
  name: Events.GuildCreate,
  async execute(guild: Guild) {
    // Check if the 'birds' role exists
    let birdsRole = guild.roles.cache.find(r => r.name === 'birds');
    if (!birdsRole) {
      // Create the 'birds' role
      birdsRole = await guild.roles.create({
        name: 'birds',
        mentionable: true,
        reason: 'VC Notify bot setup',
      });
      console.log(`Created 'birds' role in guild ${guild.name}`);
    }
  },
}; 