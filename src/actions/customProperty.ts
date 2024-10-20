import _ from 'lodash';
import * as hunterHelper from '../utils/hunter';
import { CustomProp } from '../interfaces/Hunter';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';

export default {
  validate(transaction: string, maybeValue: number | undefined, name?: string): string | void {
    if (!name) {
      return 'You must include a name for the property.'
    }
    
    if (transaction === 'update' && !maybeValue) {
      return 'BLEEERGH! You must tell us a value to update the property!'
    }

    return;
  },
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    transaction: string | undefined,
    name: string | undefined,
    maybeValue: number | undefined,
  ): Promise<void> {
    

    const errorMessage = this.validate(transaction, maybeValue, name);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const maybeHunter = await getActiveHunter(userId);
    if (_.isEmpty(maybeHunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    const hunter = maybeHunter!;
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
    
    if (transaction === 'update' && maybeValue) {
       customProps[propIndex!].value = maybeValue; 
    } 
    
    if (transaction === 'create') {
      const newProp = { key: name!, value: maybeValue ? maybeValue : 0 };
      customProps.push(newProp);
    }
    
    const updatedHunter = await updateHunterProperty(userId, hunter.hunterId, "customProps", customProps);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheet);

    return;
  }
}
