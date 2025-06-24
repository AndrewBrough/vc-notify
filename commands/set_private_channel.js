const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require("discord.js")
const { errorEmbed, writeJSON, successEmbed, readJSON } = require("../functions")

/**
 * Checks if a channel is private (not visible to @everyone)
 * @param {GuildChannel} channel - The channel to check
 * @returns {boolean} Whether the channel is private
 */
function isPrivateChannel(channel) {
	if (!channel) return false;
	const everyoneRole = channel.guild.roles.everyone;
	return !channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel);
}

module.exports = {
	slash: new SlashCommandBuilder()
		.setName("set_private_channel")
		.setDescription("Sets the private VC announcement channel to #channel (Admin only)")
		.addChannelOption(channel =>
			channel
				.setName("channel")
				.setDescription("The channel to announce private VC sessions in (must be private)")
				.setRequired(true)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async run(client, interaction) {
		// Check if user has administrator permissions
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const embed = errorEmbed()
				.setDescription("You need Administrator permissions to use this command.")

			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		const channel = interaction.options.getChannel("channel", true)

		// Check if the channel is actually private
		if (!isPrivateChannel(channel)) {
			const embed = errorEmbed()
				.setDescription(`${channel} is not a private channel. Private announcement channels must not be visible to @everyone.`)

			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		const missingPermissions = []

		const channelPerms = channel.permissionsFor(interaction.guild.members.me)

		if (!channelPerms.has(PermissionFlagsBits.ViewChannel)) missingPermissions.push("View Channel")
		if (!channelPerms.has(PermissionFlagsBits.SendMessages)) missingPermissions.push("Send Messages")
		if (!channelPerms.has(PermissionFlagsBits.MentionEveryone)) missingPermissions.push("Mention @everyone")

		if (missingPermissions.length > 0) {
			const embed = errorEmbed()
				.setDescription(`The bot is missing the following permissions for ${channel}: ${missingPermissions.map(v => `\`${v}\``).join(", ")}`)

			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		// Initialize guild data if it doesn't exist
		if (!readJSON("./data/guild.json")[interaction.guild.id]) {
			writeJSON("./data/guild.json", interaction.guild.id, {})
		}

		writeJSON("./data/guild.json", `${interaction.guild.id}.private_announcement_channel`, channel.id)

		const embed = successEmbed()
			.setDescription(`Successfully set the private VC announcement channel to ${channel}.`)

		interaction.reply({ embeds: [embed] })
	}
} 