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
    let forward: number | undefined;
    let info: boolean;

    hunterId = chooseHunterId(user.id, options);
    
    // key is a required field so no need to check for options
    key = getParam('key', options)!;
    const maybeForward = getParam('fwd', options);
    forward = maybeForward ? parseInt(maybeForward) : undefined;
    info = getBooleanParam('info', options);

    await specialMoveV2Action.execute(messenger, hunterId, key, info, forward);

    return;
  }
}
