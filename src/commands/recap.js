const moment = require('moment');
const Discord = require('discord.js');
const ddb = require('../../utils/dynamodb');
const {createRecapEmbed, createRecapsEmbed } = require('../../utils/recap');
const params = require('../../utils/params');

module.exports = {
  name: 'recap',
  description: 'Provides recap of most recent session.',
  async execute(message, args) {
    const guildId = message.guild?.id;
    if (!guildId) {
      message.channel.send('Grrr Bleep Blrrrr. Monsterbot no like. Only ask recap in General channel.');
      return;
    }

    let recaps;

    const maybeRecordLimit = params.parseAllForNumber(args);

    recaps = await ddb.getRecap(guildId, maybeRecordLimit);
    if (!recaps || recaps.length < 1) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    // see all recaps provided
    if (maybeRecordLimit && maybeRecordLimit > 1) {
      const recapsEmbed = createRecapsEmbed(recaps);
      message.channel.send({embed: recapsEmbed});
      return;
    } 

    // just get latest
    const recapEmbed = createRecapEmbed(recaps[0]);
    message.channel.send({embed: recapEmbed});
  }
};

