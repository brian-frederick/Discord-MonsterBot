module.exports = {
	name: 'onme',
	description: 'An admin command to log info about the invoker.',
	execute(message) {
    const { BOT_SPEAK } = require('../motw.json');

    console.log(`${message.author.username}:`, message.author.id);
    console.log('message channel', message.channel);
    message.channel.send(BOT_SPEAK);
	},
};
