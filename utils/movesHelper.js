function createMessages(name, total, moveContext) {
  
  if (total < 7) {
    return {
      actionReport: `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}.`,
      outcomeReport: moveContext.outcome.fail,
    }
  }
  else if (total < 10) {
    return {
      actionReport: `${name} just rolled a ${total} on ${moveContext.name}.`,
      outcomeReport: moveContext.outcome.success,
    };
  }
  else if (total < 12) {
    return {
      actionReport: `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}!`,
      outcomeReport: moveContext.outcome.high,
    };
  }
  else {
    return {
      actionReport: `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}!`,
      outcomeReport: moveContext.outcome.advanced,  
    };
  }

}

module.exports = { createMessages };