const moves = require('../utils/moves')

function createMessages(name, total, moveContext, advanced) {
  
  if (total >= 12 && advanced) {
    return {
      actionReport: `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}!`,
      outcomeReport: moveContext.outcome.advanced,
    };
  } else if (total >= 10) {
    return {
      actionReport: `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}!`,
      outcomeReport: moveContext.outcome.high,
    };
  } else if (total >= 7) {
    return {
      actionReport: `${name} just rolled ${total} on ${moveContext.name}.`,
      outcomeReport: moveContext.outcome.success,
    };
  } else {
    return {
      actionReport: { 
        embed: {
          title: 'Yikes.', 
          description: `${name} just missed on ${moveContext.name} with a roll of ${total}.`,
          image: moveContext.failGif ? moveContext.failGif : null,
        }
      },
      outcomeReport: moveContext.outcome.fail,
    };
  }
}


const description = `All moves below can be run using another hunter's stats and/or additional modifiers. For example:\n`
+`\`.m ksa\` runs the basic move with your own hunter's tough.\n`
+ `\`.m ksa 1\` runs the basic move with your own hunter's tough plus 1.\n`
+ `\`.m ksa -1\` runs the basic move with your own hunter's tough minus 1.\n`
+ `\`.m ksa @joe\` runs the basic move with Joe's hunter's tough.\n`;

function movesInfoEmbed() {
  const moveKeys = ['ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', 'um'];
    
  let movesEmbed = {
    title: 'Basic Moves',
    description,
    fields: []
  };

  moveKeys.forEach(key => {
    const moveContext = moves[key];
    movesEmbed.fields.push({ name: `${moveContext.name} - \`${key}\``, value: moveContext.description });
  });

  return movesEmbed;
}

function specialMovesInfoEmbed(specialMoves) {
  let specialMovesEmbed = {
    title: 'Special Moves',
    description,
    fields: [],
    footer: { text: 'Add or edit special moves at http://monsterbot.s3-website-us-east-1.amazonaws.com/'}
  }

  const firstTenSpecialMoves = specialMoves.slice(0,9);
  console.log('first ten length', firstTenSpecialMoves.length);
  firstTenSpecialMoves.forEach(move => {
    specialMovesEmbed.fields.push({name: `${move.name} - \`${move.key}\``, value: move.description});
  });

  return specialMovesEmbed;
}

module.exports = { createMessages, movesInfoEmbed, specialMovesInfoEmbed };