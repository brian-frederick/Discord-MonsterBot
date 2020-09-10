module.exports = {
	name: 'onme',
	description: 'on me',
	execute(message) {
    const { BOT_SPEAK } = require('../motw.json');

    console.log(`${message.author.username}:`, message.author.id);
    console.log('message channel', message.channel);
    message.channel.send(BOT_SPEAK);
	},
};
