import AWS, { DynamoDB } from 'aws-sdk';
import { CLIENT as client } from '../utils/dynamoDbClient';
import { IOutcome } from '../interfaces/iOutcome';
import { toExpressionAttributeValueOutcome } from '../utils/expressionAttributeValues';
import { AttributeValue } from 'aws-sdk/clients/dynamodb';

const TABLE = 'moves';

export async function get(guildId: string, key: string) {
  const params = {
    TableName: TABLE,
    Key: {
      'guildId': { S: guildId },
      'key': {S: key }
    }
  };

  try {
    const data = await client.getItem(params).promise();
    console.log('test move data', data);
    const move = data.Item ? AWS.DynamoDB.Converter.unmarshall(data.Item) : null;
    return move;
  } catch (error) {
    console.log(`error getting move for guildId: ${guildId} and key: ${key}`, error);
    return;
  }
}

export async function create(key: string, guildId: string, move) {
  const params = {
    TableName: TABLE,
    Item: AWS.DynamoDB.Converter.marshall(move),
    ConditionExpression: "#key <> :key AND #guildId <> :guildId",
    ExpressionAttributeNames: { 
        '#key' : 'key', 
        '#guildId' : 'guildId'
     },
    ExpressionAttributeValues: {
      ':guildId': { S: guildId },
      ':key': { S: key }
    }
  };

  try {
    const data = await client.putItem(params).promise();
    return move;
  } catch (error) {
    console.log(`error creating move for guildId: ${guildId} and key: ${key}`, JSON.stringify(error, null, 2));
    return;
  }
}

export async function update(guildId: string, key: string, description: string, outcome?: IOutcome) {
  let params: DynamoDB.Types.UpdateItemInput = {
    TableName: TABLE,
    UpdateExpression: 'SET #description = :description',
    ExpressionAttributeNames: {
      '#description': 'description',
    },
    ExpressionAttributeValues: {
      ':description': { S: description },
    },
    Key: {
      'guildId': { S: guildId },
      'key': {S: key }
    },
    ReturnValues: 'ALL_NEW'
  };

  if (outcome) {
    params.UpdateExpression += ', #outcome = :outcome';
    params.ExpressionAttributeNames!['#outcome'] = 'outcome';
    const outcomeValue: AttributeValue = toExpressionAttributeValueOutcome(outcome);
    params.ExpressionAttributeValues![':outcome'] = outcomeValue;
  }

  try {
    const data = await client.updateItem(params).promise();
    const move = data.Attributes ? AWS.DynamoDB.Converter.unmarshall(data.Attributes) : null;
    return move;
  } catch (error) {
    console.log(`error getting move for guildId: ${guildId} and key: ${key}`, JSON.stringify(error, null, 2));
    return;
  }
}