import Discord from 'discord.js';
import { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import ddb from '../utils/dynamodb';
import inventoryHelper from '../utils/inventory';
import { InventoryTransaction } from '../interfaces/enums';
import { yesNoFilter, hasYesMsg } from '../utils/messageManager';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

const confirmPossibleMatch = async (messenger: DiscordMessenger, hunterId, possibleMatch: string): Promise<boolean> => {

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
    hunterId: string, 
    transaction: InventoryTransaction,
    item: string
  ): string {
    if (!hunterId) {
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
    hunterId: string, 
    transaction,
    item: string
  ): Promise<void> {

    console.log('We are in the action now!');

    console.log(`Action params - item: ${item}, transaction: ${transaction}, hunterId: ${hunterId} `);
    
    const errorMessage = this.validate(hunterId, transaction, item);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    const hunter = await ddb.getHunter(hunterId);
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

        const confirmed = await confirmPossibleMatch(messenger, hunterId, possibleMatch);
        if (!confirmed) {
          messenger.followup(`BLAR! Very well hunter. Nothing to do here.`);
          return;
        }

        itemToRemove = possibleMatch;
      }
      
      inventoryHelper.removeItem(item, inventory);
    }

    if (transaction == InventoryTransaction.ADD) {
      inventory.push(item);
    }

    const marshalledInventory = DynamoDB.Converter.marshall({inventory});
    // dynamodb properties
    const UpdateExpression = `set inventory = :val`;
    const ExpressionAttributeValues = {
      ":val": marshalledInventory.inventory,
    };
    
    const updatedHunter = await ddb.updateHunter(hunterId, UpdateExpression, ExpressionAttributeValues);

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
