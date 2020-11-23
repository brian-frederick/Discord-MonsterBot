const moves = require('../utils/moves');
const movesHelper = require('../utils/movesHelper');
const ddb = require('../utils/dynamodb');

module.exports = {
  name: 'moveInfo',
  aliases: ['info', '!info', '!moveInfo'],
  description: 'Provides info on all basic moves.',
  params: [{name: "Move Key (text) (required)", value: "Move name for which you would like info."}],
	async execute(message, args, alias) {


    console.log('alias', alias);
    // If no move keys, they must want the full list.
    if (args.length < 1) {
      if (alias && alias.includes('!')) {
        // get special moves
        const specialMoves = await ddb.getMoves(1);
        const specialMovesEmbed = movesHelper.specialMovesInfoEmbed(specialMoves);
        message.channel.send({embed: specialMovesEmbed});
        return;
      } else {
        const movesInfoEmbed = movesHelper.movesInfoEmbed();
        message.channel.send({embed: movesInfoEmbed});
        return;
      }
    }

    const requestedMove = args[0];


    const moveContext = moves[requestedMove];

    let moveEmbed = {
      title: moveContext.name,
      fields: []
    };
  
    // add description
    if (moveContext.description && moveContext.modifiers) {
      moveEmbed.description = `modifier: ${moveContext.modifiers.property} \n${moveContext.description}`
    } else if (moveContext.modifiers) {
      moveEmbed.description = `modifier: ${moveContext.modifiers[0].property}`;
    } else if (moveContext.description) {
      moveEmbed.description = moveContext.description;
    }

    // add success outcome
    if (moveContext.outcome.success && moveContext.outcome.success.description) {
      moveEmbed.fields.push(
        {
          name: 'On a 7-9...',
          value: moveContext.outcome.success.description
        }
      );
    }

    // add high success outcome
    if (moveContext.outcome.high && moveContext.outcome.high.description) {
      moveEmbed.fields.push(
        {
          name: 'On a 10-12...',
          value: moveContext.outcome.high.description
        }
      );
    }

    // add advanced outcome
    if (moveContext.outcome.advanced && moveContext.outcome.advanced.description) {
      moveEmbed.fields.push(
        {
          name: 'On a 12+...',
          value: moveContext.outcome.advanced.description
        }
      );
    }

    // add fail outcome
    if (moveContext.outcome.fail && moveContext.outcome.fail.description) {
      moveEmbed.fields.push(
        {
          name: 'On a miss...',
          value: moveContext.outcome.fail.description
        }
      );
    }

    message.channel.send({ embed: moveEmbed });
	}
};
