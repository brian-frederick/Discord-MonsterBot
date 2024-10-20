import AWS from 'aws-sdk';
import { DeleteItemInput } from 'aws-sdk/clients/dynamodb';
import { Hunter } from '../interfaces/Hunter';
import { CLIENT as client } from '../utils/dynamoDbClient';

export const TABLE = 'hunters_v2';

export async function remove(params: DeleteItemInput): Promise<boolean> {
  let success;

  try {
    await client.deleteItem(params).promise();
    success = true;
  }
  catch (error) {
    console.error('error attempting remove hunter.');
    console.error('params:', params);
    console.error('error:', error);
    success = false;
  }
  return success;
}

export async function update(userId: string, hunterId: string, updateExpression: string, expressionAttributeValues: any) {
  const params = {
    TableName: TABLE,
    Key: {
      'userId': { S: userId },
      'hunterId': {S: hunterId }
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await client.updateItem(params).promise();
    const updatedHunter = AWS.DynamoDB.Converter.unmarshall(data!["Attributes"]!);
    return updatedHunter;
  } catch (error) {
    console.log('error updating hunter: ', error);
    return;
  }
}

export async function getAll(userId: string, activeOnly: boolean = false): Promise<any | null> {
  let params: AWS.DynamoDB.QueryInput = {
    TableName: TABLE,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: activeOnly ? "active = :active" : undefined,
    ExpressionAttributeValues: activeOnly ?
      { ":userId": {"S": userId}, ":active": {"BOOL": true} } :
      { ":userId": {"S": userId} },
  };

  try {
    var data = await client.query(params).promise();
    const hunters = data!.Items!.map(item => AWS.DynamoDB.Converter.unmarshall(item)) as Hunter[];
    console.log('hunters', hunters);
    return hunters;
  }
  catch (error) {
    console.log('Error creating hunter in hunters_v2. Error:', error);
    return null;
  }
}
