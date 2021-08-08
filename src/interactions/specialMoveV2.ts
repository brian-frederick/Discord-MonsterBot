import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam, getBooleanParam } from '../utils/interactionParams';
import specialMoveV2Action from '../actions/specialMoveV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { parseBasicMoveKey } from '../utils/params';

export default {
  name: 'specialmovev2',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let key: string;
    let hunterId: string;
    let forward: number;
    let info: boolean;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      key = getParam('key', options);
      forward = parseInt(getParam('fwd', options));
      info = getBooleanParam('info', options);
    }

    await specialMoveV2Action.execute(messenger, hunterId, key, info, forward);

    return;
  }
}
