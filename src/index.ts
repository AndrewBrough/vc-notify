import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { config } from './config/environment';
import { guildCreateEvent } from './events/guildCreate';
import { interactionCreateEvent } from './events/interactionCreate';
import { readyEvent } from './events/ready';
import { voiceStateUpdateEvent } from './events/voiceStateUpdate';
import { Event, ExtendedClient } from './types';
import { initializeDataDirectory } from './utils/init';

// Initialize data directory and files
initializeDataDirectory();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
}) as ExtendedClient;

// Register events
const events: Event[] = [
  readyEvent,
  interactionCreateEvent,
  voiceStateUpdateEvent,
  guildCreateEvent,
];

events.forEach((event) => {
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
});

console.log(`🚀 Starting ${config.bot.name}...`);
client.login(config.bot.token);
