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

export async function getAll(userId: string): Promise<any | null> {
  var params: AWS.DynamoDB.QueryInput = {
    TableName: TABLE,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": {"S": userId}
    }
  };
  
  try {
    var data = await client.query(params).promise();
    const hunters = data.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));
    console.log('hunters');
    return hunters;
  }
  catch (error) {
    console.log('Error creating hunter in hunters_v2. Error:', error);
    return null;
  }
}
