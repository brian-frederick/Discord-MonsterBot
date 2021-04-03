import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { getParam } from '../utils/interactionParams';
import infoAction from '../actions/info';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'info',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let maybeBasicMoveKey: string;
    let maybeSpecialMoveKey: string | undefined;

    if (options.length > 0) {
      maybeBasicMoveKey = getParam('basicmove', options);
      maybeSpecialMoveKey = getParam('specialmovekey', options);
    }

    await infoAction.execute(messenger, maybeBasicMoveKey, maybeSpecialMoveKey);

    return null;
  }
}
