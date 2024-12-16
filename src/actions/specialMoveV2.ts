const _ = require('lodash');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');
import { getActiveHunter } from '../services/hunterServiceV2';
import specialMovesService from '../services/specialMovesService';``
import { createInfoResponse, createModificationMessages, createSimpleEmbed } from '../utils/specialMovesHelper';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createButton } from '../utils/components';
import { ButtonCustomIdNames } from '../interfaces/enums';
import { ISpecialMove } from '../interfaces/ISpecialMove';

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
      const [embed, components] = createInfoResponse(moveContext as ISpecialMove, userId);
      messenger.respondWithEmbed(embed, components);
      return;
    }

    if (moveContext.type === 'simple') {
      const simpleEmbed = createSimpleEmbed(hunter.firstName, moveContext);
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
      outcomeEmbed = createModificationMessages(hunter.firstName, outcome.total, outcome.equation, moveContext, secondaryContext, isAdvanced);
    } else {
      outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);
    }
    
    messenger.respondWithEmbed(outcomeEmbed, maybeComponents);

    return;
  }
}
