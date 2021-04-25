import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { yesNoFilter, numFilter, requesterFilter, hasNoMsg } from '../../utils/messageManager';
import { Hunter } from '../../interfaces/Hunter';
import * as hunterHelper from '../../utils/hunter';
import { getAll } from '../../db/huntersV2';
import { createUniqueId, createHunter } from '../../services/hunterServiceV2';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string
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

    messenger.respond('Blar! Creating Hunter.');
    
    let hunterForm = {
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
    
    for (var q of hunterQuestions) {
      await messenger.followup(q.prompt);
      const collection = await messenger.channel.awaitMessages(q.filter, { max: 1, time: 120000 });
      
      if (collection.size < 1) {
        messenger.followup(`Grrr Snarlll bleep blorp. Monster not have patience. Try again.`);
        return;
      }
      
      const answer = q.filter === isRequesterNumFilter ? parseInt(collection.first().content) : collection.first().content;

      hunterForm[q.property] = answer;
    }

    const existingHunters: Hunter[] = await getAll(userId);

    const initials = hunterForm.firstName[0].toLowerCase() + hunterForm.lastName[0].toLowerCase();
    const hunterId = createUniqueId(initials, existingHunters);

    const hunterToCreate: Hunter = {
     userId,
     hunterId,
     active: true,
     ...hunterForm 
    };

    const hunterIdsToDeactivate = existingHunters.filter(h => h.active).map(h => h.hunterId);

    const createSuccess = await createHunter(userId, hunterToCreate, hunterIdsToDeactivate);
    if (!createSuccess) {
      messenger.followup("NAAARRRR. I've failed you.");
      return;
    }
  
    const statSheet = hunterHelper.statsEmbed(hunterToCreate);
    messenger.followupWithEmbed(statSheet);

    messenger.followup(`Grrr Bleep Blorp. Welcome to the fight, ${hunterToCreate.firstName}. You're a hunter. Keep your head on a swivel.`);

    return;
  }
}
