const { rollOutcomeEmbed } = require('../utils/movesHelper');
const { hexColors } = require('../content/theme');

const PUBLIC_GUILD_ID = "1";

function createSimpleEmbed(name, move) {
  
  return {
    embed: {
      title: `${name} just used ${move.name}.`,
      description: move.description,
    }    
  };
}

function createModificationMessages(name, total, equation, moveContext, secondaryContext, isAdvanced) {
  
  if (total >= 12 && isAdvanced && secondaryContext.outcome?.advanced?.description) {
      const actionReport = `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}! ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.advanced, title: `On a 12+ Advanced ${moveContext.name}....` };

      return rollOutcomeEmbed(
        hexColors.purple,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else if (total >= 10) {
      const actionReport =  `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}! ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.high, title: `On a 10+ ${moveContext.name}....` };
      
      return rollOutcomeEmbed(
        hexColors.green,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else if (total >= 7) {
      const actionReport = `${name} just rolled a ${total} on ${moveContext.name}. ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.success, title: `On a 7-9 ${moveContext.name}....` };
      
      return rollOutcomeEmbed(
        hexColors.yellow,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else {
      const actionReport = `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}. ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.fail, title: `On a failed ${moveContext.name}....`};
      const failGif = moveContext.failGif ? moveContext.failGif : null;
    
      return rollOutcomeEmbed(
        hexColors.red,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome,
        failGif
      );
  }
}

// A guild specific move takes priority over a public move with the same key.
function takePriority(moves, guildId) {
  const guildIdStr = guildId.toString();

  let move = moves.find(m => m.guildId === guildIdStr);
  if (!move) {
    move = moves.find(m => m.guildId === PUBLIC_GUILD_ID);
  }
  return move;
}

module.exports = { createSimpleEmbed, createModificationMessages, PUBLIC_GUILD_ID, takePriority };
