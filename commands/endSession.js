const ddb = require('../utils/dynamodb');
const {yesNoQuestions} = require('../utils/recap');

module.exports = {
  name: 'endsession',
  description: 'Runs end session questions and creates recap.',
  async execute(message) {

    let yesCount = 0;

    let sessionSummary = {
      guildId: null,
      timestamp: null,
      didConclude: null,
      didSave: null,
      didLearnAboutWorld: null,
      didLearnAboutHunter: null,
      recap: null
    };

    const yesNoFilter = msg => {
      return (
        msg.content.toLowerCase().includes('yes') ||
        msg.content.toLowerCase().includes('no')
      );
    };

    message.channel.send(`Your answers to the next four questions should include the words 'yes' or 'no'.`);

    // cycle through end session questions
    for (q of yesNoQuestions) {
      await message.channel.send(q.prompt);
      const collection = await message.channel.awaitMessages(yesNoFilter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        message.channel.send(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      const answer = collection.first().content;
      
      if (answer.toLowerCase().includes('yes')) {
        yesCount++;
      }

      sessionSummary[q.response] = answer;
    }

    // Create a recap of the session
    let recap = '';

    await message.channel.send(`Everyone should answer this one. What happened in this session? You have 1 minute starting NOW!`);
    let recapCollection = await message.channel.awaitMessages(msg => !msg.author.bot, { time: 40000 });
    recapCollection.forEach(msg => recap += `${msg.content} - ${msg.author}\n`);

    await message.channel.send(`20 more seconds to provide a recap...`);
    let recapCollectionFinalSeconds = await message.channel.awaitMessages(msg => !msg.author.bot, { time: 20000 });  
    recapCollectionFinalSeconds.forEach(msg => recap += `${msg.content} - ${msg.author}\n`);

    await message.channel.send(`Grrrr Beeeep CAN'T HOLD IT MUCH LONGER SEND IT NOW!`);
    let recapCollectionLastChance = await message.channel.awaitMessages(msg => !msg.author.bot, { time: 5000 });  
    recapCollectionLastChance.forEach(msg => recap += `${msg.content} - ${msg.author}\n`);
    sessionSummary.recap = recap;

    // Add admin fields to summary
    const d = new Date();
    sessionSummary.timestamp = d.getTime();
    sessionSummary.guildId = message.guild.id;

    // Save to dynamo
    const response = await ddb.createRecap(sessionSummary);
    console.log('endsession response', response);
    if (!response) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    message.channel.send(`Grrr Bleep Blorp. Your session has ended and your answers are saved.`);


    // Assess XP gained
    if (yesCount > 2) {
      message.channel.send('Mark 2 Experience!');
    } else if (yesCount > 0) {
      message.channel.send('Mark 1 Experience.')
    } else {
      message.channel.send('No experience this time. :disappointed_relieved:')
    }
  }
};
