import Discord from 'discord.js';
import { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import ddb from '../utils/dynamodb';
import inventoryHelper from '../utils/inventory';
import { InventoryTransaction } from '../interfaces/enums';
import { yesNoFilter, hasYesMsg } from '../utils/messageManager';

const confirmPossibleMatch = async (channel, hunterId, possibleMatch: string): Promise<boolean> => {

  await channel.send(`Hrrmmm. Do you want me to remove the ${possibleMatch}? (yes/no)`);
  const collection: Discord.Collection<string, Discord.Message> = await channel.awaitMessages(yesNoFilter, { max: 1, time: 30000 });
  if (collection.size < 1) {
    channel.send(`Grrr blorp. Monster not have patience. Try again.`);
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
    channel: Discord.TextChannel,
    hunterId: string, 
    transaction,
    item: string
  ): Promise<void> {

    console.log('We are in the action now!');

    console.log(`Action params - item: ${item}, transaction: ${transaction}, hunterId: ${hunterId} `);
    
    const errorMessage = this.validate(hunterId, transaction, item);
    if (errorMessage){
      channel.send(errorMessage);
      return;
    }

    const hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      channel.send("Could not find your hunter!");
      return;
    }

    let inventory: string[] = hunter.inventory ? hunter.inventory : [];

    // if no transaction type, just show existing inventory
    if (!transaction) {
      channel.send(inventoryHelper.printInventory(hunter.firstName, inventory));
      return;
    }

    if (transaction == InventoryTransaction.REMOVE) {
    
      let itemToRemove = inventory.find(inv => inv.toLowerCase() === item.toLowerCase());

      if (!itemToRemove) {
      // look for a possible match
        const possibleMatch = inventory.find(inv => inv.toLowerCase().startsWith(item));
        if (!possibleMatch) {
          channel.send(`BLAR! Cannot find ${item} to remove!`);
          return;
        }

        const confirmed = await confirmPossibleMatch(channel, hunterId, possibleMatch);
        if (!confirmed) {
          channel.send(`BLAR! Very well hunter. Nothing to do here.`);
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
      channel.send('GrrrOooph! Something has gone wrong updating our monster data! It hurts!');
      return;
    }

    channel.send(inventoryHelper.printInventory(hunter.firstName, inventory));
    return;
  }
}
