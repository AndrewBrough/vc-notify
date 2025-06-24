import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { readdirSync } from 'fs';
import { initializeDataDirectory } from './utils/init';

// Initialize data directory and files
initializeDataDirectory();

interface ExtendedClient extends Client {
  commands: Collection<string, any>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
}) as ExtendedClient;

client.commands = new Collection();

// Load commands
readdirSync('./src/commands').forEach(async (file) => {
  if (!file.endsWith('.ts')) return;
  
  const command = (await import(`./commands/${file}`)).default;
  client.commands.set(command.slash.name, command);
});

// Load events
readdirSync('./src/events').forEach(async (file) => {
  if (!file.endsWith('.ts')) return;
  
  const event = (await import(`./events/${file}`)).default;
  const fileName = file.replace('.ts', '');

  if (event.once) {
    client.once(fileName, (...args: any[]) => event.run(client, ...args));
  } else {
    client.on(fileName, (...args: any[]) => event.run(client, ...args));
  }
});

client.login(process.env.DISCORD_BOT_TOKEN); 