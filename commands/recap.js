const moment = require('moment');
const Discord = require('discord.js');
const ddb = require('../utils/dynamodb');
const {yesNoQuestions} = require('../utils/recap');

module.exports = {
  name: 'recap',
  description: 'Provides recap of most recent session.',
  async execute(message) {

    const recaps = await ddb.getRecap(message.guild.id);
    if (!recaps || recaps.length < 1) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }
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
