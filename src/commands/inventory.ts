import params from '../utils/params';
import { tag }  from '../content/commonParams';
import inventoryAction from '../actions/inventory';
import { InventoryTransaction } from '../interfaces/enums';

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'Provides information on or updates hunter inventory.',
  params: [
    { 
      name: '- Item (text)', 
      value: `Item to add or remove. Cannot include any transaction words such as 'add'. If no item is included, the hunter's existing inventory will be shown.`
    },
    tag,
    { 
      name: '- Transaction (add/remove)', 
      value: `Add or remove an item from inventory. Can also use the words 'plus', 'put', '+', '-', 'minus', 'subtract', 'sub', or 'take'.`
    }
  ],
	async execute(message, args) {

    let item;
    let transaction;
    let hunterId;

    hunterId = params.chooseHunterId(message.author.id, args);

    const update = params.parseInventoryUpdate(args);
    if (update) {
      item = update.item;
      transaction = update.type as InventoryTransaction;
    }

    await inventoryAction.execute(message.channel, hunterId, transaction, item);
    return;
	}
};
