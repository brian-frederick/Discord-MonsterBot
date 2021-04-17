import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { getAll } from '../../db/huntersV2';
import { Hunter } from '../../interfaces/Hunter';
import { changeActiveHunter } from '../../services/hunterServiceV2';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    hunterId: string
  ): Promise<void> {

    const allHunters: Hunter[] = await getAll(userId);

    const hunterToActivate = allHunters.find(h => h.hunterId === hunterId);
    if (!hunterToActivate) {
      messenger.respond(`Argh! Cannot find user with id of ${hunterId}.!`);
      messenger.followup("Use `/hunters view` to see your hunters and their id's in parentheses.");
      return;
    }

    const hunterIdsToDeactivate: string[] = allHunters.filter(h => h.active).map(h => h.hunterId);
    
    const result = await changeActiveHunter(userId, hunterToActivate.hunterId, hunterIdsToDeactivate);

    if (result) {
      messenger.respond(`YAR. ${hunterToActivate.firstName} ${hunterToActivate.lastName} has been activated.`);
    } else {
      messenger.respond(`BLRGH. We were not able to complete this for hunter ${hunterId}. I have failed you.`);
    }
    
    return;
  }
}
