function createMessages(name, total, moveContext) {
  

  if (total < 7) {
    return {
      actionReport: `Yikes. ${name} just failed to ${moveContext.action} with a ${total}.`,
      outcomeReport: "Keeper is going to make you pay....",
    }
  }
  else if (total < 10) {
    return {
      actionReport: `Hey! ${name} just ${moveContext.action} with a ${total}!`,
      outcomeReport: moveContext.outcome.success,
    };
  }
  else if (total < 12) {
    return {
      actionReport: `Hey! ${name} just solidly ${moveContext.action} with a ${total}!`,
      outcomeReport: moveContext.outcome.high,
    };
  }
  else {
    return {
      actionReport: `Wow! ${name} just perfectly ${moveContext.action} with a ${total}!`,
      outcomeReport: moveContext.outcome.advanced,  
    }
  }

}

module.exports = { createMessages };