const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require("discord.js")
const { errorEmbed, writeJSON, successEmbed, readJSON } = require("../functions")

module.exports = {
	slash: new SlashCommandBuilder()
		.setName("remove_private_channel")
		.setDescription("Removes the private announcement channel data (Admin only)")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async run(client, interaction) {
		const data = readJSON("./data/guild.json")[interaction.guild.id]

		if (!data?.private_announcement_channel) {
			const embed = errorEmbed()
				.setDescription("This server doesn't have a private announcement channel setup.")

			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		writeJSON("./data/guild.json", `${interaction.guild.id}.private_announcement_channel`, null)

		const embed = successEmbed()
			.setDescription(`Successfully removed the private VC announcement channel data.\nThe private VC announcement channel was previously <#${data.private_announcement_channel}>.`)

		interaction.reply({ embeds: [embed] })
	}
}
