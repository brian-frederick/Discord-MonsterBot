const _ = require('lodash');
const ddb = require('../../utils/dynamodb');
const {createRecapEmbed } = require('../../utils/recap');

function constructStatement(args) {
  return args.join(' ');
}

module.exports = {
  name: 'rememberlasttime',
  description: 'Adds an entry to the most recent recap.',
  aliases: ['addtorecap', 'highlight'],
  params: [{name: '- Entry (text) (required)', value: 'The entry you would like to add.'}],
  async execute(message, args) {

    const guildId = message.guild?.id;
    if (!guildId) {
      message.channel.send('Grrr Bleep Blrrrr. Monsterbot no like. Only ask recap in General channel.');
      return;
    }

    if (args.length < 1) {
      message.channel.send('Blrrr Beeeep! You must include a statement to add to the recap.')
      return;
    }

    const statementToAdd = `${constructStatement(args)} - ${message.author}\n`;

    let recaps = await ddb.getRecap(guildId, 1);
    if (!recaps || recaps.length < 1) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    let recapToUpdate = recaps[0];

    recapToUpdate.recap += statementToAdd;

    //Save to dynamo
    const response = await ddb.createRecap(recapToUpdate);
    if (!response) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    const embed = createRecapEmbed(recapToUpdate);
    message.channel.send({embed});
  }
};
