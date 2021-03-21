import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import advanceMoveAction from '../actions/advanceMove';

export default {
  name: 'advancemove',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string | undefined;
    let maybeBasicMoveKey: string;
    let isRemove: boolean;
    let maybeSpecialMoveKey: string | undefined;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      maybeBasicMoveKey = getParam('basicmove', options);
      maybeSpecialMoveKey = getParam('specialmovekey', options);
      isRemove = !!getParam('remove', options);
    }

    await advanceMoveAction.execute(channel, hunterId, maybeBasicMoveKey, maybeSpecialMoveKey, isRemove);

    return null;
  }
}
