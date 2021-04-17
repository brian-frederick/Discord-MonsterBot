import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { deleteHunter } from '../../services/hunterServiceV2';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    hunterId: string
  ): Promise<void> {

    const success = await deleteHunter(userId, hunterId);
    if (success) {
      messenger.respond("YRGH. Don't look back. They're gone forever.");
    } else {
      messenger.respond(`BLAR we were not able to delete hunter ${hunterId}.`);
    }
    
    return;
  }
}
