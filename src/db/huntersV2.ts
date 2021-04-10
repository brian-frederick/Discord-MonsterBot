import AWS from 'aws-sdk';
import { Hunter } from '../interfaces/Hunter';
import { CLIENT as client } from '../utils/dynamoDbClient';

const TABLE = 'hunters_v2';

export async function create(hunter: Hunter): Promise<Hunter | null> {
  const item = AWS.DynamoDB.Converter.marshall(hunter);
  var params: AWS.DynamoDB.PutItemInput = {
    TableName: TABLE,
    Item: item
  };
  
  try {
    await client.putItem(params).promise();
    return hunter;
  }
  catch (error) {
    console.log('Error creating hunter in hunters_v2. Error:', error);
    return null;
  }
}
