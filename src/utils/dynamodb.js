const { aws_profile } = require('../config.json');
var AWS = require('aws-sdk');
const { DynamoDB } = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

if (!!aws_profile) {
  console.log(`Setting environment specific credentials for ${aws_profile}. For local dev only.`);
  const credentials = new AWS.SharedIniFileCredentials({profile: aws_profile});
  AWS.config.credentials = credentials;
}

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const HUNTER_TABLE = 'hunters';
const MOVES_TABLE = 'moves';
const RECAPS_TABLE = 'session_recaps';

async function createHunter(hunter) {
  const item = AWS.DynamoDB.Converter.marshall(hunter);
  var params = {
    TableName: HUNTER_TABLE,
    Item: item
  };
  
  await ddb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    } 
  });

  return hunter;
}

/** Deprecated in favor of db/moves/get. */
async function getSpecialMoves(keys) {
  try {
    const params = {
      'RequestItems': {
        [MOVES_TABLE]: {
          Keys: keys
        }
      }
    };

    let data = await ddb.batchGetItem(params).promise();
    
    const moves = data.Responses[MOVES_TABLE].map(item => AWS.DynamoDB.Converter.unmarshall(item));
  
    return moves;
  }
  catch (error) {
    console.log(error);
    return;
  }
}

async function createRecap(recap) {
  const item = AWS.DynamoDB.Converter.marshall(recap);
  var params = {
    TableName: RECAPS_TABLE,
    Item: item
  };
  
  await ddb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    } 
  });

  return recap;
}

async function getRecap(guildId, recordLimit=1) {
  try {
    const params = {
      TableName: RECAPS_TABLE,
      KeyConditionExpression: "guildId = :v1",
      Limit: recordLimit,
      ExpressionAttributeValues: {
        ":v1": {"S": guildId}
      },
      ScanIndexForward: false
    };

    var data = await ddb.query(params).promise();
    const recaps = data.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));

    return recaps;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { getSpecialMoves, createRecap, getRecap, createHunter };