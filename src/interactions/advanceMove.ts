import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam, getBooleanParam } from '../utils/interactionParams';
import advanceMoveAction from '../actions/advanceMove';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'advancemove',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string | undefined;
    let maybeBasicMoveKey: string;
    let isRemove: boolean;
    let maybeSpecialMoveKey: string | undefined;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      maybeBasicMoveKey = getParam('basicmove', options);
      maybeSpecialMoveKey = getParam('specialmovekey', options);
      isRemove = getBooleanParam('remove', options);
    }

    await advanceMoveAction.execute(messenger, hunterId, maybeBasicMoveKey, maybeSpecialMoveKey, isRemove);

    return null;
  }
}
