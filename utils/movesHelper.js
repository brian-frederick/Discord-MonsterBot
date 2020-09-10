function createMessages(name, total, moveContext) {
  
  if (total < 7) {
    return {
      actionReport: { 
        embed: {
          title: 'Yikes.', 
          description: `${name} just missed on ${moveContext.name} with a roll of ${total}.`,
          image: moveContext.failGif ? moveContext.failGif : null,
        }
      },
      outcomeReport: moveContext.outcome.fail,
    }
  }
  else if (total < 10) {
    return {
      actionReport: `${name} just rolled ${total} on ${moveContext.name}.`,
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