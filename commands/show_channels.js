const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require("discord.js")
const { errorEmbed, successEmbed, readJSON } = require("../functions")

module.exports = {
	slash: new SlashCommandBuilder()
		.setName("show_channels")
		.setDescription("Shows the current announcement channel settings (Admin only)")
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

		const data = readJSON("./data/guild.json")[interaction.guild.id]

		if (!data?.announcement_channel && !data?.private_announcement_channel) {
			const embed = errorEmbed()
				.setDescription("This server doesn't have any announcement channels setup.")

			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		const embed = successEmbed()
			.setTitle("Announcement Channel Settings")

		if (data?.announcement_channel) {
			embed.addFields({ 
				name: "Public Voice Channels", 
				value: `<#${data.announcement_channel}>`, 
				inline: true 
			})
		} else {
			embed.addFields({ 
				name: "Public Voice Channels", 
				value: "Not set", 
				inline: true 
			})
		}

		if (data?.private_announcement_channel) {
			embed.addFields({ 
				name: "Private Voice Channels", 
				value: `<#${data.private_announcement_channel}>`, 
				inline: true 
			})
		} else {
			embed.addFields({ 
				name: "Private Voice Channels", 
				value: "Not set", 
				inline: true 
			})
		}

		interaction.reply({ embeds: [embed] })
	}
} 