import AWS, { DynamoDB } from 'aws-sdk';
import { CLIENT as client } from '../utils/dynamoDbClient';
import { toExpressionAttributeValueBoolean, toExpressionAttributeValueOutcome, toExpressionAttributeValueString } from '../utils/expressionAttributeValues';
import { AttributeValue, Key, QueryInput } from 'aws-sdk/clients/dynamodb';
import { ISpecialMove } from '../interfaces/ISpecialMove';
import { CUSTOM_ID_LIBRARY_IND, PUBLIC_GUILD_ID } from '../utils/specialMovesHelper';

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

export async function deleteAMove(guildId: string, key: string) {
  const params = {
    TableName: TABLE,
    Key: {
      'guildId': { S: guildId },
      'key': {S: key }
    },
    ReturnValues: 'ALL_OLD'
  };

  try {
    const data = await client.deleteItem(params).promise();
    const move = data.Attributes ? AWS.DynamoDB.Converter.unmarshall(data.Attributes) : null;
    return move;
  } catch (error) {
    console.log(`error getting move for guildId: ${guildId} and key: ${key}`, error);
    return;
  }
}

export async function getAll({
  guildId,
  searchTerm,
  startKey,
}: {
  guildId: string,
  searchTerm?: string,
  startKey?: Key
}): Promise<[ISpecialMove[], string | undefined]> {

  const params: QueryInput = searchTerm ? {
    TableName: TABLE,
    KeyConditionExpression: "#guildId = :guildId",
    FilterExpression: "contains(#name, :searchTerm)",
    ExpressionAttributeNames: { 
      '#guildId': 'guildId',
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':guildId': { S: guildId },
      ':searchTerm': { S: searchTerm }
    },
    Limit: 20,
    ExclusiveStartKey: startKey
  } : {
    TableName: TABLE,
    KeyConditionExpression: "#guildId = :guildId",
    ExpressionAttributeNames: { 
      '#guildId' : 'guildId'
    },
    ExpressionAttributeValues: {
      ':guildId': { S: guildId },
    },
    Limit: 20,
    ExclusiveStartKey: startKey
  };

  try {
    const response = await client.query(params).promise();
    console.log('bftest response', response);

    const moves = response.Items?.map(m => AWS.DynamoDB.Converter.unmarshall(m)) as ISpecialMove[] || [];
    const maybeLibraryIndicator = guildId === PUBLIC_GUILD_ID ? `_${CUSTOM_ID_LIBRARY_IND}` : '';
    
    const maybeLastEvaluatedKey = response.LastEvaluatedKey ?
      AWS.DynamoDB.Converter.unmarshall(response.LastEvaluatedKey)?.['key'] + maybeLibraryIndicator :
      undefined;
    console.log('bftest move data', moves);
    
    return [moves, maybeLastEvaluatedKey];
  } catch (error) {
    console.log(`error getting move for guildId: ${guildId}`, JSON.stringify(error, null, 2));
    return [[], undefined];
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

export async function update(guildId: string, key: string, updateFields: Partial<ISpecialMove>) {
  let params: DynamoDB.Types.UpdateItemInput = {
    TableName: TABLE,
    UpdateExpression: 'SET',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    Key: {
      'guildId': { S: guildId },
      'key': {S: key }
    },
    ReturnValues: 'ALL_NEW'
  };

  const updateableFields: [string, (value: any) => AttributeValue][] = [
    ['description', toExpressionAttributeValueString],
    ['outcome', toExpressionAttributeValueOutcome],
    ['hasLibraryCopy', toExpressionAttributeValueBoolean]
  ];

  let hasAtLeastOneUpdate = false;
  updateableFields.forEach(([field, toAttributeValue]) => {
    if (updateFields[field] !== undefined) {
      const maybeSeparator = hasAtLeastOneUpdate ? ', ' : '';
      params.UpdateExpression += `${maybeSeparator} #${field} = :${field}`;
      params.ExpressionAttributeNames!['#' + field] = field;
      params.ExpressionAttributeValues![':' + field] = toAttributeValue(updateFields[field]);
      hasAtLeastOneUpdate = true;
    }
  });

  if (!hasAtLeastOneUpdate) {
    console.error(`No fields to update for guildId: ${guildId} and key: ${key}`);
    return;
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