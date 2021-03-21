const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const {createRecapEmbed } = require('../utils/recap');
const { CommandMessenger } = require('../models/CommandMessenger');

function constructStatement(args) {
  return args.join(' ');
}

module.exports = {
  name: 'rememberlasttime',
  description: 'Adds an entry to the most recent recap.',
  aliases: ['addtorecap', 'highlight'],
  params: [{name: '- Entry (text) (required)', value: 'The entry you would like to add.'}],
  async execute(messenger, message, args) {

    const guildId = message.guild?.id;
    if (!guildId) {
      messenger.respond('Grrr Bleep Blrrrr. Monsterbot no like. Only ask recap in General channel.');
      return;
    }

    if (args.length < 1) {
      message.respond('Blrrr Beeeep! You must include a statement to add to the recap.')
      return;
    }

    const statementToAdd = `${constructStatement(args)} - ${message.author}\n`;

    let recaps = await ddb.getRecap(guildId, 1);
    if (!recaps || recaps.length < 1) {
      messenger.respond(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    let recapToUpdate = recaps[0];

    recapToUpdate.recap += statementToAdd;

    //Save to dynamo
    const response = await ddb.createRecap(recapToUpdate);
    if (!response) {
      messenger.respond(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    const embed = createRecapEmbed(recapToUpdate);
    messenger.respond({embed});
    return;
  }
};
