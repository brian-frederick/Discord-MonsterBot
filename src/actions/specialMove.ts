const _ = require('lodash');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');
import { getActiveHunter } from '../services/hunterServiceV2';
import specialMovesService from '../services/specialMovesService';
import specialMovesHelper from '../utils/specialMovesHelper';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(hunterId: string | undefined, key: string | undefined ): string {

    if (!hunterId) {
      return "Blrrrp we cannot determine who you are! WHO ARE YOU!";
    }

    if (!key) {
      return "GRRRLLLWWWW you must include a key for the special move!";
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    userId: string,
    key: string,
    forward?: number
  ): Promise<void> {

    const errMsg = this.validate(userId, key);
    if (errMsg) {
      messenger.respond(errMsg);
      return;
    }

    let hunter = await getActiveHunter(userId);
    if (_.isEmpty(hunter)) {
      messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
      hunter = someHunter;
    }

    const moveContext = await specialMovesService.getSpecialMove(key, messenger.channel.guild?.id);
    if (!moveContext || _.isEmpty(moveContext)) {
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    if (moveContext.type === 'simple') {
      const simpleEmbed = specialMovesHelper.createSimpleEmbed(hunter.firstName, moveContext);
      messenger.respondWithEmbed(simpleEmbed);
      return;
    }

    const modifiers = []

    moveContext.modifiers.forEach(mod => {
      let modifierToAdd;

      if (mod.type === 'property') {
        modifierToAdd = mod.plus ? 
          { key: mod.property, value: hunter[mod.property] } : 
          { key: mod.property, value: -hunter[mod.property] };
      }

      if (mod.type === 'extra') {
        modifierToAdd = mod.plus ? 
          { key: mod.type, value: mod.value } : 
          { key: mod.type, value: -mod.value };
      }

      modifiers.push(modifierToAdd);
    });

    if (forward) {
      modifiers.push({ key: 'input', value: forward });
    }
    
    const isAdvanced = isMoveAdvanced(key, hunter.advancedMoves);
    const outcome = dice.roll(modifiers);

    let outcomeEmbed;

    if (moveContext.type === 'modification') {
      const secondaryContext = moves[moveContext.moveToModify];
      outcomeEmbed = specialMovesHelper.createModificationMessages(hunter.firstName, outcome.total, outcome.equation, moveContext, secondaryContext, isAdvanced);
    } else {
      outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);
    }
    
    messenger.respondWithEmbed(outcomeEmbed);

    return;
  }
}
