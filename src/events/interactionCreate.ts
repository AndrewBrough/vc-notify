import { Events, Interaction } from 'discord.js';
import { ExtendedClient } from '../types';

export default {
  name: Events.InteractionCreate,
  async execute(_client: ExtendedClient, _interaction: Interaction) {
    // No commands to handle since we removed all commands
  },
}; 