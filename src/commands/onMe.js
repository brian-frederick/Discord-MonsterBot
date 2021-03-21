
module.exports = {
	name: 'onme',
	description: 'An admin command to log info about the invoker.',
	execute(messenger, message) {
    const { BOT_SPEAK } = require('../motw.json');

    console.log('username', message.author.username);
    console.log('user id', message.author.id);
    console.log('user discriminator', message.author.discriminator);

    console.log('guild id', message.guild.id);
    console.log('guild name', message.guild.name);

    messenger.respond(BOT_SPEAK);
	},
};
