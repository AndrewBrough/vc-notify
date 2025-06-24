const { EmbedBuilder } = require("discord.js")
const { readFileSync, writeFileSync } = require("fs")

module.exports = {
	readJSON(filePath) {
		const file = readFileSync(filePath, "utf-8")
		const json = JSON.parse(file)
		return json
	},

	/**
	 * Safely writes data to a JSON file at a specific path
	 * @param {string} filePath - Path to the JSON file
	 * @param {string} dataPath - Path to the data location (e.g., "guildId.property")
	 * @param {any} data - Data to write
	 */
	writeJSON(filePath, dataPath, data) {
		const file = module.exports.readJSON(filePath)
		
		// Parse the data path (e.g., "guildId.property" -> ["guildId", "property"])
		const pathParts = dataPath.split('.')
		let current = file
		
		// Navigate to the parent object
		for (let i = 0; i < pathParts.length - 1; i++) {
			if (!current[pathParts[i]]) {
				current[pathParts[i]] = {}
			}
			current = current[pathParts[i]]
		}
		
		// Set the value
		const lastPart = pathParts[pathParts.length - 1]
		if (data === null) {
			delete current[lastPart]
		} else {
			current[lastPart] = data
		}

		const newJSON = JSON.stringify(file, null, "\t")
		writeFileSync(filePath, newJSON)
	},

	/** @returns {EmbedBuilder} */
	successEmbed() {
		return new EmbedBuilder().setColor("57f287")
	},

	/** @returns {EmbedBuilder} */
	errorEmbed() {
		return new EmbedBuilder().setColor("ed4245")
	}
}
