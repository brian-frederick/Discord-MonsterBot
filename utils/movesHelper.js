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

module.exports = { createMessages };