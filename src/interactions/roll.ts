import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import rollAction from '../actions/roll';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'roll',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let hunterProperty;
    let fwd;
    let hunterId;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      hunterProperty = getParam('plus', options);
      fwd = getParam('fwd', options);
    }

    await rollAction.execute(messenger, hunterId, user.username, fwd, hunterProperty);

    return;
  }
}

