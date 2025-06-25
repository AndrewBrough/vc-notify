import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from 'discord.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data/vcNotifyRoles.json';

function readRoleMap(): Record<string, string> {
  if (!existsSync(DATA_FILE)) return {};
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeRoleMap(map: Record<string, string>) {
  writeFileSync(DATA_FILE, JSON.stringify(map, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('change-vc-notify-role')
    .setDescription('Change the role used for VC notifications')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to use for notifications')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: 'You need Manage Roles permission to use this command.',
        ephemeral: true,
      });
    }
    const role = interaction.options.getRole('role', true) as Role;
    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {
      return interaction.reply({
        content: 'I need the Manage Roles permission to do this!',
        ephemeral: true,
      });
    }
    // Save the role ID for this guild
    const map = readRoleMap();
    map[interaction.guild.id] = role.id;
    writeRoleMap(map);
    await interaction.reply({
      content: `VC notification role set to ${role.toString()}. Future notifications will mention this role.`,
      ephemeral: true,
    });
    return;
  },
};
