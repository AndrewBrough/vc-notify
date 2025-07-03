import { Client, GatewayIntentBits } from 'discord.js';
import { channelDeleteEvent } from './events/channelDelete';
import { guildAvailableEvent } from './events/guildAvailable';
import { guildCreateEvent } from './events/guildCreate';
import { guildMemberAddEvent } from './events/guildMemberAdd';
import { guildMemberRemoveEvent } from './events/guildMemberRemove';
import { guildMemberUpdateEvent } from './events/guildMemberUpdate';
import { guildUnavailableEvent } from './events/guildUnavailable';
import { interactionCreateEvent } from './events/interactionCreate';
import { readyEvent } from './events/ready';
import { voiceStateUpdateEvent } from './events/voiceStateUpdate';
import { initializeDataDirectory } from './utils/init';

console.log(`\n`);
console.log(`🔍 Environment Config:\n`, import.meta.env);
console.log(`\n`);

// Initialize data directory and files
initializeDataDirectory();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Type-safe event registration using Discord.js's built-in typing
client.once('ready', readyEvent.execute);
client.on('interactionCreate', interactionCreateEvent.execute);
client.on('voiceStateUpdate', voiceStateUpdateEvent.execute);
client.on('guildCreate', guildCreateEvent.execute);
client.on('guildMemberUpdate', guildMemberUpdateEvent.execute);
client.on('guildMemberRemove', guildMemberRemoveEvent.execute);
client.on('guildMemberAdd', guildMemberAddEvent.execute);
client.on('channelDelete', channelDeleteEvent.execute);
client.on('guildUnavailable', guildUnavailableEvent.execute);
client.on('guildAvailable', guildAvailableEvent.execute);

console.log(`🔍 Logging in with token: ${import.meta.env.DISCORD_BOT_TOKEN}`);
client.login(import.meta.env.DISCORD_BOT_TOKEN);
