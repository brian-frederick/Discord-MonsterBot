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

const TABLE = 'guilds';

async function addGuild(guild) {
  const item = AWS.DynamoDB.Converter.marshall(guild);
  var params = {
    TableName: TABLE,
    Item: item
  };
  
  await ddb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    } else {
      console.log('create guild dynamo data: ', data);
    }
  });

  return guild;
}

async function deleteGuild(guild) {
  console.log('guild in delete dynamo call' , guild);
  var params = {
    TableName: TABLE,
    Key: { 
      id: {
        S: guild.id
      },
      name: {
        S: guild.name
      }
    }
  };
  
  await ddb.deleteItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    } else {
      console.log('delete guild dynamo data: ', data);
    }
  });
}

module.exports = { addGuild, deleteGuild };
