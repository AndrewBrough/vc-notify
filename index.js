const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { readdirSync } = require("fs")
require('dotenv').config()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	]
})

client.commands = new Collection()

readdirSync("./commands").forEach(file => {
	const command = require(`./commands/${file}`)

	client.commands.set(command.slash.name, command)
})

readdirSync("./events").forEach(file => {
	const event = require(`./events/${file}`)

	const fileName = file.replace(".js", "")

	if (event.once) {
		client.once(fileName, (...args) => event.run(client, ...args))
	} else {
		client.on(fileName, (...args) => event.run(client, ...args))
	}
})

client.login(process.env.DISCORD_BOT_TOKEN)