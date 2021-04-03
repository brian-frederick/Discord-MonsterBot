import _ from 'lodash';
import * as hunterHelper from '../utils/hunter';
import ddb from '../utils/dynamodb';
import { CustomProp } from '../interfaces/Hunter';
import { updateHunterProperty } from '../services/hunterService';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(transaction: string, maybeValue: number | undefined): string | void {
    if (transaction === 'update' && !maybeValue) {
      return 'BLEEERGH! You must tell us a value to update the property!'
    }

    return;
  },
  async execute(
    messenger: DiscordMessenger,
    hunterId: string,
    transaction: string,
    name: string,
    maybeValue: number | undefined,
  ): Promise<void> {
    

    const errorMessage = this.validate(transaction, maybeValue);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    let customProps: CustomProp[] = hunter.customProps ? hunter.customProps : [];
    let propIndex = customProps.findIndex(p => p.key === name);
    
    if (
      (transaction === 'remove' || transaction === 'update') &&
      propIndex < 0
    ) {
      messenger.respond(`Grrgle Yarrgh. Could not find property ${name} to remove.`);
      return;
    }

    if (transaction === 'remove') {
      customProps.splice(propIndex, 1);
    } 
    
    if (transaction === 'update') {
       customProps[propIndex].value = maybeValue; 
    } 
    
    if (transaction === 'create') {
      console.log('maybeValue', maybeValue);
      const newProp = { key: name, value: maybeValue ? maybeValue : 0 };
      customProps.push(newProp);
    }
    
    const updatedHunter = await updateHunterProperty(hunterId, "customProps", customProps);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheet);

    return;
  }
}
