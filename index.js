const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('starting up! beep boop raaaarrr!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  const aliasCommand = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command && !aliasCommand) return;

	try {
    if (command) {
      command.execute(message, args);
    }
    else {
      aliasCommand.execute(message, args, commandName);
    }
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


// login to Discord with your app's token
client.login(token);
