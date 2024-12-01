const _ = require('lodash');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');
import { getActiveHunter } from '../services/hunterServiceV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createButton } from '../utils/components';

export default {
  validate(moveKey: string, moveContext): string | undefined {
    if (!moveContext) {
      return `Blrrrgh. Could not find a basic move called ${moveKey}!`;
    };
  },

  async execute(
    messenger: DiscordMessenger,
    hunterId: string,
    moveKey?: string,
    forward?: number
  ): Promise<void> {

    let maybeHunter = await getActiveHunter(hunterId);
    if (_.isEmpty(maybeHunter)) {
      messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
      maybeHunter = someHunter;
    }

    const hunter = maybeHunter!;
    const moveContext = moveKey ? moves[moveKey] : undefined;

    const errorMessage = this.validate(moveKey, moveContext);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const modifiers: {key: string, value: number}[] = [];

    moveContext.modifiers.forEach(mod => {
      modifiers.push({ key: mod.property, value: hunter[mod.property] })
    });

    if (forward) {
      modifiers.push({key: 'forward', value: forward });
    }

    const isAdvanced = isMoveAdvanced(moveKey, hunter.advancedMoves);

    const outcome = dice.roll(modifiers);    
    const outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);
    const markXpButton = outcome.total <= 6 ?
      createButton("Mark XP", 1, "mark_experience") : null;

    const maybeComponents = markXpButton ?
      [createActionRow([markXpButton])] : null;
      
    messenger.respondWithEmbed(outcomeEmbed, maybeComponents);

    return;
  }
}
