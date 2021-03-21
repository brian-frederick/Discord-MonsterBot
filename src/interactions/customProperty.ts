import Discord from 'discord.js';
import customProperty from '../actions/customProperty';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'customproperty',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string;
    let transaction: string;
    let name: string;
    let maybeValue: number | undefined;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      name = getParam('name', options);
      maybeValue = parseInt(getParam('value', options));
      transaction = getParam('transaction', options);
    }

    await customProperty.execute(messenger, hunterId, transaction, name, maybeValue);
    return;
  }
}
