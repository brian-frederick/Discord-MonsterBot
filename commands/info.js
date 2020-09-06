module.exports = {
  name: 'info',
	description: 'info on moves',
	async execute(message, args) {
    const moves =  require('../utils/moves');

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
