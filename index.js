const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token } = require('./config.json');
const { addGuild, deleteGuild } = require('./db/guilds');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', () => {
  console.log('starting up! beep boop raaaarrr!');
  console.log('Sending out love to the following guilds:');

  let totalGuilds = 0;
  for (var g of client.guilds.cache) {
    totalGuilds++;
    console.log('-----------------');
    console.log(g[1].id);
    console.log(g[1].name);
  }
  console.log('------------');
  console.log('total guilds: ', totalGuilds);
  console.log('------------');
});

client.on('guildCreate', guild => {
  console.log('guild created.');
  console.log('id: ', guild.id);
  console.log('name: ', guild.name);
  try {
    addGuild({ id: guild.id, name: guild.name });
  } catch (error) {
    console.log('Error on guild create.');
    console.error(error);
  }
});

client.on('guildDelete', guild => {
  console.log('guild deleted.');
  console.log('id: ', guild.id);
  console.log('name: ', guild.name);
  try {
    deleteGuild({ id: guild.id, name: guild.name });
  } catch (error) {
    console.log('Error on guild delete.');
    console.error(error);
  }
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

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

try {
  console.log('attempting to login with ', token);
  client.login(token);
} catch (error) {
  console.log(error);
  console.error(error);
}
