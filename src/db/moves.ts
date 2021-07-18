import AWS from 'aws-sdk';import { CLIENT as client } from '../utils/dynamoDbClient';

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
    console.log('move data', data);
    const move = data.Item ? AWS.DynamoDB.Converter.unmarshall(data.Item) : null;
    return move;
  } catch (error) {
    console.log(`error getting move for guildId: ${guildId} and key: ${key}`, error);
    return;
  }
}
