import { AttributeValue } from 'aws-sdk/clients/dynamodb'
import { IOutcome } from "../interfaces/iOutcome";

export function toExpressionAttributeValueOutcome(outcome: IOutcome): AttributeValue {
  
  return {
    M: {
      advanced: outcome.advanced ? {
        M: {
          description: {
            S: outcome.advanced.description,
          },
          title: {
            S: outcome.advanced.title
          }
        }
      }  : { NULL: true},
      fail: outcome.fail ? {
        M: {
          description: {
            S: outcome.fail.description
          },
          title: {
            S: outcome.fail.title
          }
        }
      }  : { NULL: true},
      high: outcome.high ? {
        M: {
          description: {
            S: outcome.high.description
          },
          title: {
            S: outcome.high.title
          }
        }
      } : { NULL: true},
      success: outcome.success ? {
        M: {
          description: {
            S: outcome.success.description
          },
          title: {
            S: outcome.success.title
          }
        }
      } : { NULL: true}
    }
  };
};

export const toExpressionAttributeValueString = (value: string): AttributeValue => {
  return { S: value };
}

export const toExpressionAttributeValueBoolean = (value: boolean): AttributeValue => {
  return { BOOL: value };
}


