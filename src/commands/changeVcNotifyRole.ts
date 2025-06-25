import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from 'discord.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const ROLE_DATA_FILE = './data/vcNotifyRoles.json';

function readRoleMap(): Record<string, string> {
  if (!existsSync(ROLE_DATA_FILE)) return {};
  return JSON.parse(readFileSync(ROLE_DATA_FILE, 'utf-8'));
}

function writeRoleMap(roleMap: Record<string, string>): void {
  writeFileSync(ROLE_DATA_FILE, JSON.stringify(roleMap, null, 2));
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

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) return;

    try {
      await validatePermissions(interaction);
      await updateNotificationRole(interaction);
    } catch (error) {
      console.error('Error in change-vc-notify-role command:', error);
      await sendErrorResponse(
        interaction,
        'There was an error while executing this command!'
      );
    }
  },
};

async function validatePermissions(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const member = await interaction.guild!.members.fetch(interaction.user.id);

  if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
    await interaction.reply({
      content: 'You need Manage Roles permission to use this command.',
      ephemeral: true,
    });
    throw new Error('User lacks Manage Roles permission');
  }

  if (
    !interaction.guild!.members.me?.permissions.has(
      PermissionFlagsBits.ManageRoles
    )
  ) {
    await interaction.reply({
      content: 'I need the Manage Roles permission to do this!',
      ephemeral: true,
    });
    throw new Error('Bot lacks Manage Roles permission');
  }
}

async function updateNotificationRole(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const role = interaction.options.getRole('role', true) as Role;

  // Save the role ID for this guild
  const roleMap = readRoleMap();
  roleMap[interaction.guild!.id] = role.id;
  writeRoleMap(roleMap);

  await interaction.reply({
    content: `VC notification role set to ${role.toString()}. Future notifications will mention this role.`,
    ephemeral: true,
  });
}

async function sendErrorResponse(
  interaction: ChatInputCommandInteraction,
  message: string
): Promise<void> {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ content: message, ephemeral: true });
  } else {
    await interaction.reply({ content: message, ephemeral: true });
  }
}
