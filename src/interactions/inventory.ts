import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { InventoryTransaction } from '../interfaces/enums';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import inventoryAction from '../actions/inventory';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'inventory',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let item;
    let transaction;
    let hunterId;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      item = getParam('item', options);
      transaction = getParam('transaction', options) as InventoryTransaction;
    }

    await inventoryAction.execute(messenger, hunterId, transaction, item);

    return null;
  }
}
