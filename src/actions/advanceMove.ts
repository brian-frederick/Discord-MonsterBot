import Discord from 'discord.js';
import { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import ddb from '../utils/dynamodb';
import moves from '../utils/moves';
import specialMovesService from '../services/specialMovesService';
import hunterHelper from '../utils/hunter';

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
    channel: Discord.TextChannel,
    hunterId: string | undefined, 
    maybeBasicMoveKey:string | undefined,
    maybeSpecialMoveKey: string | undefined,
    isRemove: boolean,
  ): Promise<void> {

    console.log('We are in the action now!');
    console.log(`Action params - maybeBasicMoveKey: ${maybeBasicMoveKey}, maybeSpecialMoveKey: ${maybeSpecialMoveKey}, isRemove: ${isRemove}, hunterId: ${hunterId} `);
    
    const errorMessage = this.validate(hunterId, maybeBasicMoveKey, maybeSpecialMoveKey);
    if (errorMessage){
      channel.send(errorMessage);
      return;
    }

    const hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      channel.send("Could not find your hunter!");
      return;
    }

    const advancedMoves = hunter.advancedMoves ? hunter.advancedMoves : [];
    
    // Do we just need to remove something here?
    if (isRemove) {
      const keyToRemove = maybeBasicMoveKey ? maybeBasicMoveKey : maybeSpecialMoveKey;
      const i = advancedMoves.findIndex(i => i.key === keyToRemove);
      if (i < 0) {
        channel.send(`Blrgh! Cannot find an advanced move with the key of ${keyToRemove}.`);
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

        const specialMoveContext = await specialMovesService.getSpecialMove(maybeSpecialMoveKey, channel.guild?.id);
  
        if (specialMoveContext) {
          moveToAdvance = { key: maybeSpecialMoveKey, value: specialMoveContext.name };
        }
      }
  
      // Hmmm doesn't look like a special move either. Let's bail.
      if (!moveToAdvance) {
        channel.send('BLARRR We could not find a move to advance!!');
        return;
      }

      advancedMoves.push(moveToAdvance);
    }

    // We've updated the advanced moves. Just need to save it now.
    const marshalled = DynamoDB.Converter.marshall({advancedMoves});
    // dynamodb properties
    const UpdateExpression = `set advancedMoves = :val`;
    const ExpressionAttributeValues = {
      ":val": marshalled.advancedMoves,
    };
    
    const updatedHunter = await ddb.updateHunter(hunterId, UpdateExpression, ExpressionAttributeValues);

    if (!updatedHunter) {
      channel.send('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    channel.send({ embed: statSheet });

    return;
  }
}
