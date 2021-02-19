const moment = require('moment');
const Discord = require('discord.js');

const yesNoQuestions = [
  { prompt: 'Did we conclude the current mystery?', response: 'didConclude' },
  { prompt: 'Did we save someone from certain death (or worse)?', response: 'didSave' },
  { prompt: 'Did we learn something new and important about the world?', response: 'didLearnAboutWorld' },
  { prompt: 'Did we learn something new and important about one of the hunters?', response: 'didLearnAboutHunter' },
];

function createRecapEmbed(recap, includeQAndA) {
  const recapDate = moment(recap.timestamp).utcOffset(-5).format("MMMM Do");
  let recapEmbed = new Discord.MessageEmbed();
  recapEmbed.setTitle(`On ${recapDate}...`);
  recapEmbed.setDescription(recap.recap);

  if (includeQAndA) {
    const fields = yesNoQuestions.map(q => {
      return { name: q.prompt, value: recap[q.response]}
    });

    recapEmbed.addFields(fields);
  }

  return recapEmbed;
}


module.exports = { yesNoQuestions, createRecapEmbed };
