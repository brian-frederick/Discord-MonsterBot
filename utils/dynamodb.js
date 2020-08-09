// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const { DynamoDB } = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

async function getHunter(userId) {

  try {
    var params = {
      TableName: 'monsterbot_hunters',
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

module.exports = { getHunter };

