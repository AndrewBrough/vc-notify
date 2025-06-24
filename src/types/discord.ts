import { Client, Events } from 'discord.js';

export interface ExtendedClient extends Client {
  // No commands needed since we removed all commands
}

export interface Event {
  name: Events | string;
  once?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any[]) => Promise<void> | void;
} 