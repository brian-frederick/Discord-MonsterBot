module.exports = {
	name: 'test',
	description: 'An admin function to test bot state.',
	execute(messenger, message) {
    const { TEST_MESSAGE } = require('../motw.json');

    messenger.respond(TEST_MESSAGE);
	},
};
