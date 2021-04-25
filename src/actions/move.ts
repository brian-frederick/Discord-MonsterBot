const _ = require('lodash');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');
import { getActiveHunter } from '../services/hunterServiceV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(): string {
    return;
  },

  async execute(
    messenger: DiscordMessenger,
    hunterId: string,
    moveKey: string,
    forward?: number
  ): Promise<void> {

    let hunter = await getActiveHunter(hunterId);
    if (_.isEmpty(hunter)) {
      messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
      hunter = someHunter;
    }

    const moveContext = moves[moveKey];

    const modifiers = [];

    moveContext.modifiers.forEach(mod => {
      modifiers.push({ key: mod.property, value: hunter[mod.property] })
    });

    if (forward) {
      modifiers.push({key: 'forward', value: forward });
    }

    const isAdvanced = isMoveAdvanced(moveKey, hunter.advancedMoves);

    const outcome = dice.roll(modifiers);    
    const outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);

    messenger.respondWithEmbed(outcomeEmbed);

    return;
  }
}
