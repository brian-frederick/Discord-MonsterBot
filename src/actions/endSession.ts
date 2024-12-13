import ddb from '../utils/dynamodb';
import { yesNoQuestions } from '../utils/recap';
import { yesNoFilter, hasYesMsg } from '../utils/messageManager';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createBeerButton, createButton } from '../utils/components';
import { captureMessage } from '@sentry/node';
import { ButtonCustomIdNames } from '../interfaces/enums';

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

    interface ISessionSummary {
      guildId: string | null;
      timestamp: number | null;
      didConclude: boolean | null;
      didSave: boolean | null;
      didLearnAboutWorld: boolean | null;
      didLearnAboutHunter: boolean | null;
      recap: string | null;
    }

    let sessionSummary: ISessionSummary = {
      guildId,
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
      const collection = await messenger.channel.awaitMessages({ filter: yesNoFilter,max: 1, time: 120000 });
      
      if (collection.size < 1) {
        messenger.followup(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      if (hasYesMsg(collection)) {
        yesCount++;
      }

      sessionSummary[q.response] = collection!.first()!.content;
    }

    const unixTimePlusOneMinute = Math.floor(new Date().getTime() / 1000) + 60;

    // Appears as "in 59 seconds", "in 58 seconds", etc. in Discord.
    const countdown = `<t:${unixTimePlusOneMinute}:R>`;

    await messenger.followup(`Everyone should answer this one. What happened in this session? Submit your answer ${countdown}.`);
    
    setTimeout(() => messenger.followup(`Provide a recap ${countdown}`), 40000);
    setTimeout(() => messenger.followup(`Grrrr Beeeeep Session ends ${countdown}. CANNOT HOLD IT MUCH LONGER SEND IT NOW!`), 55000);
    
    // Create a recap of the session
    let recap = '';
    let recapCollection = await messenger.channel.awaitMessages({filter: msg => !msg.author.bot, time: 65000 });
    recapCollection.forEach(msg => recap += `${msg.content} - ${msg.author}\n`);
    captureMessage(`recap: ${recap}`, 'info');

    sessionSummary.recap = recap;

    // Add admin fields to summary
    const d = new Date();
    sessionSummary.timestamp = d.getTime();

    // Save to dynamo
    const response = await ddb.createRecap(sessionSummary);
    console.log('new endsession response', response);
    if (!response) {
      messenger.followup('Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.');
      return;
    }

    let experienceMsg: string;
    let markXpButton;

    // Assess XP gained
    if (yesCount > 2) {
      experienceMsg = "You've earned 2 XP!";
      markXpButton = createButton("Mark 2 Experience", 3, `${ButtonCustomIdNames.mark}_2_experience`);
    } else if (yesCount > 0) {
      experienceMsg = "You've earned 1 XP!";
      markXpButton = createButton("Mark 1 Experience", 3, `${ButtonCustomIdNames.mark}_1_experience`);
    } else {
      experienceMsg = 'No experience this time. :disappointed_relieved:'
    }

    const beerButton = createBeerButton();

    const components = markXpButton ?
      [createActionRow([markXpButton, beerButton])] : [createActionRow([beerButton])];

    const finalMsg = 'Grrr Bleep Blorp. Your session has ended and your answers are saved. You can use the /recap command to review them at your next session. '
      + experienceMsg;

    messenger.followup(finalMsg, components);

    return;
  }
}
