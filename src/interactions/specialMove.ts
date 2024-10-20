import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import specialMoveAction from '../actions/specialMove';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'specialmove',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string;
    let forward: number | undefined = undefined;
    let key: string;

    hunterId = chooseHunterId(user.id, options);

    // key is a required field so no need to check for options
    key = getParam('key', options)!;
    const maybeForward = getParam('forward', options);
    forward = maybeForward ? parseInt(maybeForward) : undefined;

    await specialMoveAction.execute(messenger, hunterId, key, forward);

    return;
  }
}
