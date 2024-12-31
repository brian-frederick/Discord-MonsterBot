import _ from 'lodash';
import * as hunterHelper from '../../utils/hunter';
import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { getAll } from '../../db/huntersV2';
import { createHunter } from '../../services/hunterServiceV2';
import { Hunter } from '../../interfaces/Hunter';

interface IHunterParams {
    firstName: string,
    lastName?: string,
    type: string,
    charm: number,
    cool: number,
    sharp: number,
    tough: number,
    weird: number
}

export default {

  async execute(
    messenger: DiscordMessenger,
    userId: string,
    hunterParams: IHunterParams
  ): Promise<void> {
    
    let hunterForm = {
      firstName: hunterParams.firstName,
      lastName: hunterParams.lastName || '',
      type: hunterParams.type,
      experience: 0,
      harm: 0,
      luck: 0,
      charm: hunterParams.charm,
      cool: hunterParams.cool,
      sharp: hunterParams.sharp,
      tough: hunterParams.tough,
      weird: hunterParams.weird,
      inventory: [],
      advancedMoves: []
    };


    const existingHunters: Hunter[] = await getAll(userId);

    const firstInitial = hunterForm.firstName[0].toLowerCase();
    const lastInitial = hunterForm.lastName[0]?.toLowerCase() || '';
    const initials = firstInitial + lastInitial;
    const hunterId = hunterHelper.createUniqueId(initials, existingHunters);

    const hunterToCreate: Hunter = {
      userId,
      hunterId,
      active: true,
      ...hunterForm 
    };

    const hunterIdsToDeactivate = existingHunters.filter(h => h.active).map(h => h.hunterId);

    const createSuccess = await createHunter(userId, hunterToCreate, hunterIdsToDeactivate);
    if (!createSuccess) {
      messenger.respondV2({ content: "NAAARRRR. I've failed you." });
      return;
    }
    
    const proTip = 'Next try adding your inventory with the `/inventory` command. Or add special moves with the `/customMoves` command.';
    const welcomeMsg = `Grrr Bleep Blorp. Welcome to the fight, ${hunterForm.firstName}.` + '\n' + proTip;
    const statSheet = hunterHelper.statsEmbed(hunterToCreate);
    messenger.respondV2({ embeds: [statSheet], content: welcomeMsg }, true);

    return;
  }
}
