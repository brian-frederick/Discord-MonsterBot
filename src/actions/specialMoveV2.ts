const _ = require('lodash');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');
import { getActiveHunter } from '../services/hunterServiceV2';
import specialMovesService from '../services/specialMovesService';``
import specialMovesHelper from '../utils/specialMovesHelper';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createButton } from '../utils/components';
import { ButtonCustomIdNames } from '../interfaces/enums';

export default {

  async execute(
    messenger: DiscordMessenger,
    userId: string,
    key: string,
    info: boolean,
    forward?: number,
  ): Promise<void> {

    const moveContext = await specialMovesService.getSpecialMoveV2(key, messenger.channel.guild?.id);
    if (!moveContext || _.isEmpty(moveContext)) {
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    let maybeHunter = await getActiveHunter(userId);
    if (_.isEmpty(maybeHunter)) {
      messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
      maybeHunter = someHunter;
    }

    const hunter = maybeHunter!;

    if (info) {
      const infoEmbed = movesHelper.createInfoEmbed(moveContext);
      const editButton = createButton("Edit", 1, `${ButtonCustomIdNames.edit_move}_${key}`)
      messenger.respondWithEmbed(infoEmbed, [createActionRow([editButton])]);
      return;
    }

    if (moveContext.type === 'simple') {
      const simpleEmbed = specialMovesHelper.createSimpleEmbed(hunter.firstName, moveContext);
      messenger.respondWithEmbed(simpleEmbed);
      return;
    }

    const modifiers:{key: string, value: number}[] = []

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
    const markXpButton = outcome.total <= 6 ?
      createButton("Mark XP", 3,`${ButtonCustomIdNames.mark}_experience`) : null;
    const maybeComponents = markXpButton ?
    [ createActionRow([markXpButton])] : null;


    if (moveContext.type === 'modification') {
      const secondaryContext = moves[moveContext.moveToModify];
      outcomeEmbed = specialMovesHelper.createModificationMessages(hunter.firstName, outcome.total, outcome.equation, moveContext, secondaryContext, isAdvanced);
    } else {
      outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);
    }
    
    messenger.respondWithEmbed(outcomeEmbed, maybeComponents);

    return;
  }
}
