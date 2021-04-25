import { TransactWriteItem } from 'aws-sdk/clients/dynamodb';
import { CLIENT as client } from '../utils/dynamoDbClient';

/**
 * Conducts multiple updates at once of multiple tables, if needed. Returns true or false depending on success.
 * @param transactions 
 */
 export async function transactWrite(transactions: TransactWriteItem[]): Promise<boolean> {
  const params = {
    TransactItems: transactions
  };

  let success;

  try {
    await client.transactWriteItems(params).promise();
    success = true;
  } catch (error) {
    console.error('error attempting transact write.');
    console.error('params:', params);
    console.error('error:', error);
    success = false;
  }

  return success;
}
