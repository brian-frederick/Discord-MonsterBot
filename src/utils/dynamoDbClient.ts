import { aws_profile } from '../config.json';
import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

if (!!aws_profile) {
  console.log(`Setting environment specific credentials for ${aws_profile}. For local dev only.`);
  const credentials = new AWS.SharedIniFileCredentials({profile: aws_profile});
  AWS.config.credentials = credentials;
}

export const CLIENT = new AWS.DynamoDB({apiVersion: '2012-08-10'});
