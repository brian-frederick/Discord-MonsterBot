const PUBLIC_GUILD_ID = "1";

function createSimpleEmbed(name, move) {
  
  return {
    embed: {
      title: `${name} just used ${move.name}.`,
      description: move.description,
    }    
  };
}

function createModificationMessages(name, total, moveContext, secondaryContext, isAdvanced) {
  
  if (total >= 12 && isAdvanced) {
    return {
      actionReport: `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}! ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.advanced, title: `On a 12+ Advanced ${moveContext.name}....` },  
    };
  } else if (total >= 10) {
    return {
      actionReport: `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}! ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.high, title: `On a 10+ ${moveContext.name}....` }
    };
  } else if (total >= 7) {
    return {
      actionReport: `${name} just rolled a ${total} on ${moveContext.name}. ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.success, title: `On a 7-9 ${moveContext.name}....` }
    };
  } else {
    return {
      actionReport: `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}. ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.fail, title: `On a failed ${moveContext.name}....`},
    }
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
