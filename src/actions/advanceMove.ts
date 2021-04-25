import _ from 'lodash';
import moves from '../utils/moves';
import specialMovesService from '../services/specialMovesService';
import * as hunterHelper from '../utils/hunter';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';

export default {
  validate(
    hunterId: string, 
    maybeBasicMoveKey: string | undefined,
    maybeSpecialMoveKey: string | undefined
  ): string {
    if (!hunterId) {
      return 'Yrrrgh! I do not know which hunter to use!'
    }

    if (!maybeBasicMoveKey && !maybeSpecialMoveKey) {
      return 'Blrrgh. Cannot find a move to advance!';
    }

    if (maybeBasicMoveKey && maybeSpecialMoveKey) {
      return `GRRRR. Do not make me decide whether to update ${maybeBasicMoveKey} or ${maybeSpecialMoveKey}! I am just a dumb monsterbot!`;
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    userId: string | undefined, 
    maybeBasicMoveKey:string | undefined,
    maybeSpecialMoveKey: string | undefined,
    isRemove: boolean,
  ): Promise<void> {

    console.log('We are in the action now!');
    console.log(`Action params - maybeBasicMoveKey: ${maybeBasicMoveKey}, maybeSpecialMoveKey: ${maybeSpecialMoveKey}, isRemove: ${isRemove}, hunterId: ${userId} `);
    
    const errorMessage = this.validate(userId, maybeBasicMoveKey, maybeSpecialMoveKey);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const hunter = await getActiveHunter(userId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    const advancedMoves = hunter.advancedMoves ? hunter.advancedMoves : [];
    
    // Do we just need to remove something here?
    if (isRemove) {
      const keyToRemove = maybeBasicMoveKey ? maybeBasicMoveKey : maybeSpecialMoveKey;
      const i = advancedMoves.findIndex(i => i.key === keyToRemove);
      if (i < 0) {
        messenger.respond(`Blrgh! Cannot find an advanced move with the key of ${keyToRemove}.`);
        return;
      }
      
      advancedMoves.splice(i, 1);

    } else { // Ok, it's not a remove. We need to add something.
      let moveToAdvance;
  
      if (maybeBasicMoveKey) {
        const moveContext = moves[maybeBasicMoveKey];
        moveToAdvance = {key: maybeBasicMoveKey, value: moveContext.name };
      }

      
      if (maybeSpecialMoveKey) {

        const specialMoveContext = await specialMovesService.getSpecialMove(maybeSpecialMoveKey, messenger.channel.guild?.id);
  
        if (specialMoveContext) {
          moveToAdvance = { key: maybeSpecialMoveKey, value: specialMoveContext.name };
        }
      }
  
      // Hmmm doesn't look like a special move either. Let's bail.
      if (!moveToAdvance) {
        messenger.respond('BLARRR We could not find a move to advance!!');
        return;
      }

      advancedMoves.push(moveToAdvance);
    }

    const updatedHunter = await updateHunterProperty(userId, hunter.hunterId, "advancedMoves", advancedMoves);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }

    const statSheetEmbed = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheetEmbed);

    return;
  }
}
