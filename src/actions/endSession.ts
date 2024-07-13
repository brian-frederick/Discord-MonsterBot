import ddb from '../utils/dynamodb';
import { yesNoQuestions } from '../utils/recap';
import { yesNoFilter, hasYesMsg } from '../utils/messageManager';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createBeerButton, createButton } from '../utils/components';
import { captureMessage } from '@sentry/node';

export default {
  validate(guildId) {
    if (!guildId) {
      return 'Grrr Bleep Blrrrr. Monsterbot no like. Cannot end a session in direct messages!';
    }
    return;
  },
  async execute(
    messenger: DiscordMessenger,
  ): Promise<void> {
    
    console.log('here is the channel', messenger.channel);
    const guildId = messenger.channel.guild?.id;

    const errorMessage = this.validate(guildId);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

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

    messenger.respond(`Your answers to the next four questions should include the words 'yes' or 'no'.`);

    // cycle through end session questions
    for (var q of yesNoQuestions) {
      await messenger.followup(q.prompt);
      const collection = await messenger.channel.awaitMessages(yesNoFilter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        messenger.followup(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      if (hasYesMsg(collection)) {
        yesCount++;
      }

      sessionSummary[q.response] = collection.first().content;
    }



    await messenger.followup(`Everyone should answer this one. What happened in this session? You have 1 minute starting NOW!`);
    
    setTimeout(() => messenger.followup('20 more seconds to provide a recap...'), 40000);
    setTimeout(() => messenger.followup('Grrrr Beeeep CANNOT HOLD IT MUCH LONGER SEND IT NOW!'), 55000);
    
    // Create a recap of the session
    let recap = '';
    let recapCollection = await messenger.channel.awaitMessages(msg => !msg.author.bot, { time: 65000 });
    recapCollection.forEach(msg => recap += `${msg.content} - ${msg.author}\n`);
    captureMessage(`recap: ${recap}`, 'info');

    sessionSummary.recap = recap;

    // Add admin fields to summary
    const d = new Date();
    sessionSummary.timestamp = d.getTime();
    sessionSummary.guildId = guildId;

    // Save to dynamo
    const response = await ddb.createRecap(sessionSummary);
    console.log('new endsession response', response);
    if (!response) {
      messenger.followup('Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.');
      return;
    }

    messenger.followup(`Grrr Bleep Blorp. Your session has ended and your answers are saved.`);

    let experienceMsg: string;
    let markXpButton;

    // Assess XP gained
    if (yesCount > 2) {
      experienceMsg = 'Mark 2 Experience!';
      markXpButton =createButton("Mark 2 XP", 1, "mark-2-experience");
    } else if (yesCount > 0) {
      experienceMsg = 'Mark 1 Experience.'
      markXpButton = createButton("Mark 1 XP", 1, "mark-1-experience");
    } else {
      experienceMsg = 'No experience this time. :disappointed_relieved:'
    }

    const beerButton = createBeerButton();

    const maybeComponents = markXpButton ?
      [createActionRow([markXpButton, beerButton])] : [createActionRow([beerButton])];

    messenger.followup(experienceMsg, maybeComponents);

    return;
  }
}
