import { Client, GatewayIntentBits } from 'discord.js';
import { guildCreateEvent } from './events/guildCreate';
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
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Type-safe event registration using Discord.js's built-in typing
client.once('ready', readyEvent.execute);
client.on('interactionCreate', interactionCreateEvent.execute);
client.on('voiceStateUpdate', voiceStateUpdateEvent.execute);
client.on('guildCreate', guildCreateEvent.execute);
client.on('guildCreate', guildCreateEvent.execute);

console.log(`🔍 Logging in with token: ${import.meta.env.DISCORD_BOT_TOKEN}`);
client.login(import.meta.env.DISCORD_BOT_TOKEN);
