import fs from 'fs';
import Discord from 'discord.js';
import { prefix, token } from  './config.json';
import { addGuild, deleteGuild } from './db/guilds' ;
import { Command } from './interfaces/Command';
import { SlashCommandMessenger } from './models/SlashMessenger';
import { CommandMessenger } from './models/CommandMessenger';

const client = new Discord.Client();

// dynamically create commands
let commands: Map<string, Command> = new Map();
let aliasedCommands: Map<string, Command> = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command: Command = require(`./commands/${file}`);
  commands.set(command.name, command);
  
  if (command.aliases) {
    command.aliases.forEach(alias => aliasedCommands.set(alias, command));
  }
}

// dynamically create interactions
let interactions = new Map();

const interactionFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
  const interaction = require (`./interactions/${file}`);
	interactions.set(interaction.default.name, interaction.default);
}

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

// @ts-ignore
client.ws.on('INTERACTION_CREATE', async request => {
  console.log('interaction ahoy: ');
  console.log(request);
  
  let channel = client.channels.cache.get(request.channel_id);
  if (!channel) {
    console.log('trying a fetch');
    channel = await client.channels.fetch(request.channel_id);
  }

  const messenger = new SlashCommandMessenger(
    channel as Discord.TextChannel,
    request.token,
    request.id
  );

  // if this is a dm, the user object is one level higher.
  const user = request.member ? request.member.user : request.user;

  let interaction = interactions.get(request.data.name);
  let options = request.data.options;

  // If we couldn't find an interaction - maybe this is a custom slash command.
  // Since they're custom, we have no idea what they're named!
  if (!interaction) {
    interaction = interactions.get('specialmovev2');
    const commandNameAsOption = { name: 'key', value: request.data.name };
    options = request.data.options ? 
      [...request.data.options, commandNameAsOption] :
      [commandNameAsOption];
  }

  interaction.execute(messenger, user, request.guild_id, options);
})

client.on('message', message => {
  let command: Command;
  let aliasCommand: Command;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  command = commands.get(commandName);

  if (!command) {
    aliasCommand = aliasedCommands.get(commandName);
  }

  if (!command && !aliasCommand) return;

	try {
    const messenger = new CommandMessenger(message.channel as Discord.TextChannel);
    if (command) {
      command.execute(messenger, message, args);
    }
    else {
      aliasCommand.execute(messenger, message, args, commandName);
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
