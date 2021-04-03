const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'help',
  description: 'Provides details on all commands.',
  params: [{name: '- Command (text)', value: 'Name of command you would like details for.'}],
	execute(messenger, message, args) {
    let commands = [];
    let embed = new Discord.MessageEmbed();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`./${file}`);
      commands.push(command);
    }

    if (args.length > 0) {
      const command = commands.find( com => 
        com.name === args[0].toLowerCase() ||
        (com.aliases && com.aliases.includes(args[0].toLowerCase()))
      );
      
      if (!command) {
        messenger.respond(`Please enter a valid command name for details. Could not find command with name ${args[0]}.`);
        return;
      }

      embed.setTitle(command.name.toUpperCase());
      embed.setDescription(command.description);

      if (command.params) {
        embed.addFields(command.params);
      }

      if (command.aliases) {
        embed.setFooter(`AKA: ${command.aliases.join(', ')}`);
      }

    } else {
      embed.setTitle('Commands');
      commands.forEach(com => {
        embed.fields.push({ name: com.name, value: com.description })
      });
    }

    messenger.respond(embed);
	},
};
