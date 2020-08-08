module.exports = {
	name: 'help',
	description: 'help',
	execute(message) {
    const { AVAILABLE_COMMANDS, AVAILABLE_MOVES } = require('../motw.json');
    
    message.channel.send(AVAILABLE_COMMANDS);
    message.channel.send(AVAILABLE_MOVES);
	},
};
