module.exports = {
	name: 'test',
	description: 'test',
	execute(message) {
    const { TEST_MESSAGE } = require('../motw.json');

    message.channel.send(TEST_MESSAGE);
	},
};
