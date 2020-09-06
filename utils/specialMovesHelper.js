function createSimpleEmbed(move) {
  
  return {
    embed: {
      title: move.name,
      description: move.description,
    }    
  };
}

function createModificationMessages(name, total, moveContext, secondaryContext) {
  
  if (total < 7) {
    return {
      actionReport: `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}. ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.fail, title: `On a failed ${moveContext.name}....`},
    }
  }
  else if (total < 10) {
    return {
      actionReport: `${name} just rolled a ${total} on ${moveContext.name}. ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.success, title: `On a 7-9 ${moveContext.name}....` }
    };
  }
  else if (total < 12) {
    return {
      actionReport: `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}! ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.high, title: `On a 10+ ${moveContext.name}....` }
    };
  }
  else {
    return {
      actionReport: `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}! ${moveContext.name} modifies ${secondaryContext.name}.`,
      outcomeReport: { ...secondaryContext.outcome.success, title: `On a 12+... ${moveContext.name}....` },  
    };
  }

}

module.exports = { createSimpleEmbed, createModificationMessages };
