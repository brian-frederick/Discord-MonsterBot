// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const { DynamoDB } = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const HUNTER_TABLE = 'monsterbot_hunters';
const MOVES_TABLE = 'monsterbot_special_moves';
const RECAPS_TABLE = 'monsterbot_session_recaps';

async function getHunter(userId) {

  try {
    var params = {
      TableName: HUNTER_TABLE,
      Key: {
        'userId': {S: userId }
      }
    };

    var data = await ddb.getItem(params).promise();
    const hunter = AWS.DynamoDB.Converter.unmarshall(data["Item"]);
    return hunter;
  } 
  catch (error) {
    console.log(error);
  }
}

async function updateHunter(userId, UpdateExpression, ExpressionAttributeValues) {

  try {
    var params = {
      TableName: HUNTER_TABLE,
      Key: {
        'userId': {S: userId }
      },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW"
    };
  
    let data = await ddb.updateItem(params).promise();
    const updatedHunter = AWS.DynamoDB.Converter.unmarshall(data["Attributes"]);
    return updatedHunter;
  }
  catch (error) {
    console.log(error);
  }
}

async function getMove(moveKey) {
  try {
    const params = {
      TableName: MOVES_TABLE,
      Key: {
        'key': {S: moveKey }
      }
    };

    var data = await ddb.getItem(params).promise();
    const move = AWS.DynamoDB.Converter.unmarshall(data["Item"]);
    return move;
  } 
  catch (error) {
    console.log(error);
    return null;
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

module.exports = { getHunter, updateHunter, getMove, createRecap, getRecap };

