import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import guildCreate from './events/guildCreate';
import interactionCreate from './events/interactionCreate';
import ready from './events/ready';
import voiceStateUpdate from './events/voiceStateUpdate';
import { Event, ExtendedClient } from './types';
import { initializeDataDirectory } from './utils/init';

// Initialize data directory and files
initializeDataDirectory();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
}) as ExtendedClient;

// Register events
const events: Event[] = [
  ready,
  interactionCreate,
  voiceStateUpdate,
  guildCreate,
];

events.forEach((event) => {
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
