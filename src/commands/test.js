module.exports = {
	name: 'test',
	description: 'An admin function to test bot state.',
	execute(message) {
    const { TEST_MESSAGE } = require('../motw.json');

    message.channel.send(TEST_MESSAGE);
	},
};
