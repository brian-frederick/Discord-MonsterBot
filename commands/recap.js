const moment = require('moment');
const Discord = require('discord.js');
const ddb = require('../utils/dynamodb');
const {yesNoQuestions} = require('../utils/recap');
const params = require('../utils/params');

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
      let recapsEmbed = new Discord.MessageEmbed();
      recapsEmbed.setTitle('Recaps');
      
      const fields = recaps.reverse().map(r => {
        return {name: moment(r.timestamp).format("MMMM Do"), value: r.recap}
      });
      recapsEmbed.addFields(fields);

      message.channel.send({embed: recapsEmbed});
      return;
    } 

    // just get latest
    const recap = recaps[0];
    const recapDate = moment(recap.timestamp).format("MMMM Do");
    let recapEmbed = new Discord.MessageEmbed();
    recapEmbed.setTitle(`On ${recapDate}...`);
    recapEmbed.setDescription(recap.recap);

    const fields = yesNoQuestions.map(q => {
        return { name: q.prompt, value: recap[q.response]}
    });

    recapEmbed.addFields(fields);

    message.channel.send({embed: recapEmbed});
  }
};

