const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const hunterHelper = require('../utils/hunter');

module.exports = {
  name: 'makemeahunter',
  description: 'Creates a hunter for the user.',
  async execute(message) {

    const requesterId = message.author.id;

    const yesNoFilter = msg => {
      return (
        isFromRequesterFilter(msg) &&
        (msg.content.toLowerCase().includes('yes') || msg.content.toLowerCase().includes('no'))
      );
    };

    const isFromRequesterFilter = (msg) => msg.author.id === requesterId;

    const numFilter = msg => {
      return (
        isFromRequesterFilter(msg) && !isNaN(msg.content)
      );
    };

    // Warn them we will overwrite if they have an existing hunter
    const existingHunter = await ddb.getHunter(requesterId);
    if (!_.isEmpty(existingHunter)) {
      await message.channel.send(
        `Blrp Screee! I see you already have a hunter - ${existingHunter.firstName} ${existingHunter.lastName}. Do you wish to replace them? "Yes" or "No"?`
      );
      const collection = await message.channel.awaitMessages(yesNoFilter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        message.channel.send(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      const shouldProceed = collection.first().content;

      if (shouldProceed.toLowerCase() === 'no') {
        message.channel.send('Bluuurp Beep Boop. Very well hunter. Safe travels.');
        return;
      }
    }

    // If no existing hunter or they're okay with overwriting, proceed with questions.
    const hunterQuestions = [
      { prompt: `What is your hunter's first name? (Text)`, property: 'firstName', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's last name? (Text)`, property: 'lastName', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's type? (Text)`, property: 'type', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's charm? (Number)`, property: 'charm', filter: numFilter},
      { prompt: `What is your hunter's cool? (Number)`, property: 'cool', filter: numFilter},
      { prompt: `What is your hunter's sharp? (Number)`, property: 'sharp', filter: numFilter},
      { prompt: `What is your hunter's tough? (Number)`, property: 'tough', filter: numFilter},
      { prompt: `What is your hunter's weird? (Number)`, property: 'weird', filter: numFilter},
    ];

    let hunter = {
      userId: requesterId,
      experience: 0,
      harm: 0,
      luck: 0,
    };

    message.channel.send('Krrrrcchhhhhh Snarrrrrl bleeep. So you wish to hunt monsters...');

    for (q of hunterQuestions) {
      await message.channel.send(q.prompt);
      const collection = await message.channel.awaitMessages(q.filter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        message.channel.send(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      const answer = q.filter === numFilter ? parseInt(collection.first().content) : collection.first().content;

      hunter[q.property] = answer;
    }

    const response = await ddb.createHunter(hunter);
    console.log('endsession response', response);
    if (!response) {
      message.channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    const statSheet = hunterHelper.statsEmbed(hunter);
    message.channel.send({ embed: statSheet });

    message.channel.send(`Grrr Bleep Blorp. Welcome to the fight, ${hunter.firstName}. You're a hunter. Keep your head on a swivel.`);
  }
};
