import AWS, { DynamoDB } from 'aws-sdk';
import { TransactWriteItem, DeleteItemInput } from 'aws-sdk/clients/dynamodb';

import { TABLE, update, remove } from '../db/huntersV2';
import { transactWrite } from '../db/transactions';
import { Hunter } from '../interfaces/Hunter';

export async function updateHunterProperty(userId: string, hunterId: string, propertyName: string, newVal: any) {
  const marshalled = DynamoDB.Converter.marshall({newVal});
  const updateExpression = `set ${propertyName} = :val`;
  const expressionAttributeValues = {
    ":val": marshalled.newVal,
  };

  return await update(userId, hunterId, updateExpression, expressionAttributeValues);
}

export async function deleteHunter(userId: string, hunterId: string): Promise<boolean> {
  const params: DeleteItemInput = {
    TableName: TABLE,
    Key: {
      userId: { S: userId },
      hunterId: { S: hunterId }
    },
    ConditionExpression: 'attribute_exists(hunterId)'
  };

  return await remove(params);
}

export function createUniqueId(initials: string, existingHunters: Hunter[]): string {

  const existingIds: string[] = existingHunters.map(h => h.hunterId);

  const createUniqueIdLoop = (modifier?: number): string => {
    const potentialId = modifier ? initials + modifier.toString() : initials;
    
    if (existingIds.includes(potentialId)) {
      const nextModifier = modifier ? modifier + 1 : 1;
      return createUniqueIdLoop(nextModifier);
    } else {
      return potentialId;
    }
  };

  return createUniqueIdLoop();

}

export async function changeActiveHunter(userId, hunterIdToActivate: string, hunterIdsToDeactivate: string[]): Promise<boolean> {

  let transactItems: TransactWriteItem[] = [
    {
      Update: {
        TableName: TABLE,
        Key: {
          userId: { S: userId },
          hunterId: { S: hunterIdToActivate }
        },
        UpdateExpression: `set active = :active`,
        ExpressionAttributeValues: {
          ':active': { BOOL: true } 
        }
      }
    }
  ];

  // This should only ever be one id. But just to avoid sticky situations, we'll iterate through a list.
  hunterIdsToDeactivate.forEach(hId => transactItems.push(
    {
      Update: {
        TableName: TABLE,
        Key: {
          userId: { S: userId },
          hunterId: { S: hId }
        },
        UpdateExpression: `set active = :active`,
        ExpressionAttributeValues: {
          ':active': { BOOL: false } 
        }
      }
    }
  ));

  return await transactWrite(transactItems);
};

export async function createHunter(userId, hunter: Hunter, hunterIdsToDeactivate: string[]): Promise<boolean> {
  const item = AWS.DynamoDB.Converter.marshall(hunter);
  
  let transactItems: TransactWriteItem[] = [
    {
      Put: {
        TableName: TABLE,
        Item: item
      }
    }
  ];

  // This should only ever be one id. But just to avoid sticky situations, we'll iterate through a list.
  hunterIdsToDeactivate.forEach(hId => transactItems.push(
    {
      Update: {
        TableName: TABLE,
        Key: {
          userId: { S: userId },
          hunterId: { S: hId }
        },
        UpdateExpression: `set active = :active`,
        ExpressionAttributeValues: {
          ':active': { BOOL: false } 
        }
      }
    }
  ));

  return await transactWrite(transactItems);
};
