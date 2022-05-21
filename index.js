// Require the necessary discord.js classes
const fs = require("node:fs")
const { Client, Collection, Intents } = require('discord.js');
const { token, integrations } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Create a Collection of commands for easier access from other files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
commandFiles.forEach((fileName) => {
	const command = require(`./commands/${fileName}`)
	client.commands.set(command.data.name, command) // Key is the name, value is the module
})

// Handle the respective commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({content: 'There was an error while executing this command, sorry!', ephemeral: true})
	}
});

// Go ahead and grab/initialize all respective events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
eventFiles.forEach((fileName) => {
	const event = require(`./events/${fileName}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
})

// When the client is ready, run this code (only once)
client.once('ready', (c) => {
	
});

// Login to Discord with your client's token
client.login(token);