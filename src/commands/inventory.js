const { DynamoDB } = require('aws-sdk');
const { tag } = require('../../content/commonParams');

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
    const _ = require('lodash');
    const ddb = require('../../utils/dynamodb');
    const params = require('../../utils/params');
    const hunterHelper = require('../../utils/hunter');
    const inventoryHelper = require('../../utils/inventory');

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send("Could not find your hunter!");
      return;
    }
    
    const update = params.parseInventoryUpdate(args);
    const inventory = hunter.inventory ? hunter.inventory : [];

    if (!update) {
      message.channel.send(inventoryHelper.printInventory(hunter.firstName, inventory));
      return;
    }

    if (update.type === 'remove') {
      if (!inventory.includes(update.item)) {
        message.channel.send(`Could not find a ${update.item}`)
      } else {
        inventoryHelper.removeItem(update.item, inventory);
      }
    }

    if (update.type === 'add') {
      inventory.push(update.item);
    }

    const marshalledInventory = DynamoDB.Converter.marshall({inventory});
    // dynamodb properties
    const UpdateExpression = `set inventory = :val`;
    const ExpressionAttributeValues = {
      ":val": marshalledInventory.inventory,
    };
    
    const updatedHunter = await ddb.updateHunter(userIdInQuestion, UpdateExpression, ExpressionAttributeValues);

    if (!updatedHunter) {
      message.channel.send('Something has gone wrong! Help!');
      return;
    }

    message.channel.send(inventoryHelper.printInventory(hunter.firstName, inventory));
	}
};
