import Discord from 'discord.js';
const { DynamoDB } = require('aws-sdk');
const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const inventoryHelper = require('../utils/inventory');
const { tag } = require('../content/commonParams');
import { InventoryTransaction } from '../interfaces/enums';

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

    let inventory = hunter.inventory ? hunter.inventory : [];

    // if no transaction type, just show existing inventory
    if (!transaction) {
      channel.send(inventoryHelper.printInventory(hunter.firstName, inventory));
      return;
    }

    if (transaction == InventoryTransaction.REMOVE) {
      if (!inventory.includes(item)) {
        channel.send(`Could not find a ${item}`)
      } else {
        inventoryHelper.removeItem(item, inventory);
      }
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
