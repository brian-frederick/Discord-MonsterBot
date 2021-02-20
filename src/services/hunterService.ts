import { DynamoDB } from 'aws-sdk';
import ddb from '../utils/dynamodb';

export async function updateHunterProperty(hunterId: string, propertyName: string, newVal: any) {
  const marshalled = DynamoDB.Converter.marshall({newVal});
  const UpdateExpression = `set ${propertyName} = :val`;
  const ExpressionAttributeValues = {
    ":val": marshalled.newVal,
  };

  const updatedHunter = await ddb.updateHunter(hunterId, UpdateExpression, ExpressionAttributeValues);
  return updatedHunter;
}
