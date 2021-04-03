import ddb from '../utils/dynamodb';
import _ from 'lodash';
import * as hunterHelper from '../utils/hunter';
import { yesNoFilter, numFilter, requesterFilter, hasNoMsg } from '../utils/messageManager';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
  ): Promise<void> {
    
    const requesterId = userId;

    const isRequesterYesNoFilter = msg => {
      return (
        requesterFilter(requesterId, msg) &&
        yesNoFilter(msg)
      );
    };

    const isFromRequesterFilter = msg => requesterFilter(requesterId, msg);

    const isRequesterNumFilter = msg => {
      return (
        requesterFilter(requesterId, msg) &&
        numFilter(msg)
      );
    };

    const hunterQuestions = [
      { prompt: `What is your hunter's first name? (Text)`, property: 'firstName', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's last name? (Text)`, property: 'lastName', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's type? (The Chosen, The Mundane, etc.) (Text)`, property: 'type', filter: isFromRequesterFilter},
      { prompt: `What is your hunter's charm? (Number)`, property: 'charm', filter: isRequesterNumFilter},
      { prompt: `What is your hunter's cool? (Number)`, property: 'cool', filter: isRequesterNumFilter},
      { prompt: `What is your hunter's sharp? (Number)`, property: 'sharp', filter: isRequesterNumFilter},
      { prompt: `What is your hunter's tough? (Number)`, property: 'tough', filter: isRequesterNumFilter},
      { prompt: `What is your hunter's weird? (Number)`, property: 'weird', filter: isRequesterNumFilter},
    ];

    let hunter = {
      userId: requesterId,
      firstName: '',
      lastName: '',
      type: '',
      experience: 0,
      harm: 0,
      luck: 0,
      charm: 0,
      cool: 0,
      sharp: 0,
      tough: 0,
      weird: 0,
      inventory: [],
      advancedMoves: []
    };

    messenger.respond('Krrrrcchhhhhh Snarrrrrl bleeep. So you wish to hunt monsters...');

    // Warn them we will overwrite if they have an existing hunter
    const existingHunter = await ddb.getHunter(requesterId);
    if (!_.isEmpty(existingHunter)) {
      await messenger.followup(
        `Blrp Screee! I see you already have a hunter - ${existingHunter.firstName} ${existingHunter.lastName}. Do you wish to replace them? "Yes" or "No"?`
      );
      const collection = await messenger.channel.awaitMessages(isRequesterYesNoFilter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        messenger.followup(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      if (hasNoMsg(collection)) {
        messenger.followup('Bluuurp Beep Boop. Very well hunter. Safe travels.');
        return;
      }
    }

    // If no existing hunter or they're okay with overwriting, proceed with questions.
 

    for (var q of hunterQuestions) {
      await messenger.followup(q.prompt);
      const collection = await messenger.channel.awaitMessages(q.filter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        messenger.followup(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      const answer = q.filter === isRequesterNumFilter ? parseInt(collection.first().content) : collection.first().content;

      hunter[q.property] = answer;
    }

    const response = await ddb.createHunter(hunter);
    console.log('endsession response', response);
    if (!response) {
      messenger.followup(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    const statSheet = hunterHelper.statsEmbed(hunter);
    messenger.followupWithEmbed(statSheet);

    messenger.followup(`Grrr Bleep Blorp. Welcome to the fight, ${hunter.firstName}. You're a hunter. Keep your head on a swivel.`);

    return;
  }
}
