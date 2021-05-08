import Discord from 'discord.js';
import _ from 'lodash';
import inventoryHelper from '../utils/inventory';
import { InventoryTransaction } from '../interfaces/enums';
import { yesNoFilter, hasYesMsg } from '../utils/messageManager';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';

const confirmPossibleMatch = async (messenger: DiscordMessenger, possibleMatch: string): Promise<boolean> => {

  await messenger.followup(`Hrrmmm. Do you want me to remove the ${possibleMatch}? (yes/no)`);
  const collection: Discord.Collection<string, Discord.Message> = await messenger.channel.awaitMessages(yesNoFilter, { max: 1, time: 30000 });
  if (collection.size < 1) {
    messenger.followup(`Grrr blorp. Monster not have patience. Try again.`);
    return false;
  }

  return hasYesMsg(collection);
}

export default {
  validate(
    userId: string, 
    transaction: InventoryTransaction,
    item: string
  ): string {
    if (!userId) {
      return 'Yrrrgh! I do not know which hunter to use!'
    }

    if (item && !transaction) {
      return 'Blrrgh. If you enter an item you must tell me whether to add or remove it!';
    }

    if (transaction && !item) {
      return `Blrrgh. I don't know what item to ${transaction}.`;
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    userId: string, 
    transaction,
    item: string
  ): Promise<void> {

    console.log('We are in the action now!');

    console.log(`Action params - item: ${item}, transaction: ${transaction}, hunterId: ${userId} `);
    
    const errorMessage = this.validate(userId, transaction, item);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const hunter = await getActiveHunter(userId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    let inventory: string[] = hunter.inventory ? hunter.inventory : [];

    // if no transaction type, just show existing inventory
    if (!transaction) {
      if (inventory.length < 1) {
        messenger.respond(`${hunter.firstName}'s inventory is empty`);
      } else {
        messenger.respondWithEmbed(inventoryHelper.printInventory(hunter.firstName, inventory));
      }
      return;
    }

    await messenger.respond(`Blar! Attempting to ${transaction} item: ${item}...`)
    if (transaction == InventoryTransaction.REMOVE) {
    
      let itemToRemove = inventory.find(inv => inv.toLowerCase() === item.toLowerCase());

      if (!itemToRemove) {
      // look for a possible match
        const possibleMatch = inventory.find(inv => inv.toLowerCase().startsWith(item));
        if (!possibleMatch) {
          messenger.followup(`BLAR! Cannot find ${item} to remove!`);
          return;
        }

        const confirmed = await confirmPossibleMatch(messenger, possibleMatch);
        if (!confirmed) {
          messenger.followup(`BLAR! Very well hunter. Nothing to do here.`);
          return;
        }

        itemToRemove = possibleMatch;
      }

      inventoryHelper.removeItem(itemToRemove, inventory);
    }

    if (transaction == InventoryTransaction.ADD) {
      inventory.push(item);
    }
    
    const updatedHunter = await updateHunterProperty(userId, hunter.hunterId, 'inventory', inventory);

    if (!updatedHunter) {
      messenger.followup('GrrrOooph! Something has gone wrong updating our monster data! It hurts!');
      return;
    }
    
    if (inventory.length < 1) {
      messenger.followup(`${hunter.firstName}'s inventory is empty`);
    } else {
      messenger.followupWithEmbed(inventoryHelper.printInventory(hunter.firstName, inventory));
    }
    return;
  }
}
