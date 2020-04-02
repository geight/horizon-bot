const fs = require('fs');
const Enmap = require("enmap");
const Discord = require('discord.js');
const { prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.horizon = new Enmap({name: "horizon"});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {

    console.log("Message");
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command)) return;

	try {
        client.commands.get(command).execute(Discord, Enmap, client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(process.env.discordToken);