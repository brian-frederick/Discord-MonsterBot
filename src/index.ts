require("./instrument");
import fs from 'fs';
import Discord from 'discord.js';
import { prefix, token } from  './config.json';
import { addGuild, deleteGuild } from './db/guilds' ;
import { Command } from './interfaces/Command';
import { SlashCommandMessenger } from './models/SlashMessenger';
import { CommandMessenger } from './models/CommandMessenger';
import { DiscordInteractionType } from './interfaces/enums';
import { parseCustomIdName } from './utils/componentInteractionParams';
import * as Sentry from '@sentry/node';

const client = new Discord.Client({intents: [
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.MESSAGE_CONTENT,
  Discord.Intents.FLAGS.GUILD_MEMBERS,
  Discord.Intents.FLAGS.DIRECT_MESSAGES
],});

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

// looks for js files even though we're using ts.
// Build process converts back to js.
const interactionFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
  const interaction = require (`./interactions/${file}`);
	interactions.set(interaction.default.name, interaction.default);
}

let componentInteractions = new Map();
const componentInteractionFiles = fs.readdirSync('./component-interactions').filter(file => file.endsWith('.js'));

for (const file of componentInteractionFiles) {
  const componentInteraction = require (`./component-interactions/${file}`);
	componentInteractions.set(componentInteraction.default.name, componentInteraction.default);
}

let modalSubmissions = new Map();
const modalSubmissionFiles = fs.readdirSync('./modal-submissions').filter(file => file.endsWith('.js'));

for (const file of modalSubmissionFiles) {
  const modalSubmission = require (`./modal-submissions/${file}`);
  modalSubmissions.set(modalSubmission.default.name, modalSubmission.default);
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
  Sentry.setTags({
    'event_type': 'guildCreate',
    'server_id': guild.id
  });
  Sentry.captureMessage(`Guild added to monsterbot! Welcome ${guild.name}`, 'info');
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
  Sentry.setTags({
    'event_type': 'guildDelete',
    'server_id': guild.id
  });
  Sentry.captureMessage(`Guild deleted from monsterbot! So long ${guild.name}`, 'warning');
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
  Sentry.setTags({
    'event_type': 'command',
    'server_id': request.guild_id,
    'is_zoo_crew': request.guild_id === '737491286604644362'
  });

  console.log('interaction ahoy: ');
  console.log(JSON.stringify(request, null, 2));
  
  let channel = client.channels?.cache?.get(request.channel_id);
  if (!channel) {
    console.log('Could not get channel from cache. Attempting to fetch.');
    const maybeFetchedChannel = await client.channels.fetch(request.channel_id);
    channel = maybeFetchedChannel ?? undefined;
  }

  const messenger = new SlashCommandMessenger(
    channel as Discord.TextChannel,
    request.token,
    request.id
  );

  // if this is a dm, the user object is one level higher.
  const user = request.member ? request.member.user : request.user;
  Sentry.setUser({ username: user?.username, id: user?.id });

  if (request.type === DiscordInteractionType.modalSubmit) {
    const customId = request.data.custom_id;
    const modalName = parseCustomIdName(customId);
    const componentInteraction = modalSubmissions.get(modalName);
    if (!componentInteraction) {
      console.log('Blurgh we could not find a modal submission using custom id:', customId);
    }

    Sentry.setTag('command', customId);
    Sentry.captureMessage(`Attempting modal submission: ${customId}`, 'info');
    componentInteraction.execute(request.data, messenger, user);
    return;
  }
  
  if (request.type === DiscordInteractionType.messageComponent) {
    const customId = request.data.custom_id;
    const componentInteractionName = parseCustomIdName(customId);
    const componentInteraction = componentInteractions.get(componentInteractionName);
    if (!componentInteraction) {
      console.log('Blurgh we could not find a component interaction using custom id:', customId);
    }

    Sentry.setTag('command', customId);
    Sentry.captureMessage(`Attempting custom command: ${customId}`, 'info');
    componentInteraction.execute(customId, messenger, user, request.data.values);

    return;
  }

  Sentry.setTag('command', request.data.name);
  Sentry.captureMessage(`Attempting command: ${request.data.name}`, 'info');
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

  await interaction.execute(messenger, user, request.guild_id, options);
  
  Sentry.setTags({
    'command': null,
    'event_type': null,
    'is_zoo_crew': null,
    'server_id': null,
    'server_name': null
  });

  Sentry.setUser(null);
})

client.on('messageCreate', message => {
  let command: Command | undefined = undefined;
  let aliasCommand: Command | undefined = undefined;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args?.shift()?.toLowerCase();
  
  Sentry.setTags({
    'command': commandName,
    'event_type': 'messageCreate',
    'is_zoo_crew': message.guild?.id === '737491286604644362',
    'server_id': message?.guild?.id
  });

  if (!commandName) {
    Sentry.captureMessage('Command name is undefined');
    return;
  }

  Sentry.setUser({ username: message?.member?.user.username, id: message?.member?.user.id });

  Sentry.captureMessage(`Someone is still using messages for move: ${commandName}`, 'warning');

  command = commands.get(commandName!);

  if (!command) {
    aliasCommand = aliasedCommands.get(commandName);
  }

  if (!command && !aliasCommand) {
    Sentry.captureMessage(`Someone attempted to use a command name that doesn't exist: ${commandName}.`, 'error');
    return;
  }

	try {
    const messenger = new CommandMessenger(message.channel as Discord.TextChannel);
    if (command) {
      command.execute(messenger, message, args);
    }
    else {
      aliasCommand!.execute(messenger, message, args, commandName);
    }
	} catch (error) {
		console.error(error);
    Sentry.captureException(error);
		message.reply('there was an error trying to execute that command!');
	}

  Sentry.setTags({
    'command': null,
    'event_type': null,
    'is_zoo_crew': null,
    'server_id': null,
    'server_name': null
  });

  Sentry.setUser(null);
});

try {
  console.log('attempting to login with ', token);
  console.log('newly revised version for reboot v5');
  Sentry.captureMessage('Logging in.', 'info');
  client.login(token);
} catch (error) {
  console.log(error);
  console.error(error);
}
