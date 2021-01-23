const { hexColors } = require('../content/theme');

function createOutcomeEmbed(name, total, equation, moveContext, advanced) {

  if (total >= 12 && advanced && moveContext.outcome?.advanced?.description) {

    return rollOutcomeEmbed(
      hexColors.purple,
      `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}!`,
      equation,
      moveContext.name,
      moveContext.description,
      moveContext.outcome.advanced
    );

  } else if (total >= 10) {
    
    return rollOutcomeEmbed(
      hexColors.green,
      `Hey! ${name} just rolled a ${total} on ${moveContext.name}!`,
      equation,
      moveContext.name,
      moveContext.description,
      moveContext.outcome.high
    );

  } else if (total >= 7) {

    return rollOutcomeEmbed(
      hexColors.yellow,
      `Ok. ${name} just rolled ${total} on ${moveContext.name}.`,
      equation,
      moveContext.name,
      moveContext.description,
      moveContext.outcome.success
    );

  } else {
      const failGif = moveContext.failGif ? moveContext.failGif : null;
      return rollOutcomeEmbed(
        hexColors.red,
        `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}.`,
        equation,
        moveContext.name,
        moveContext.description,
        moveContext.outcome.fail,
        failGif
      );
    }
}

const rollOutcomeEmbed = (color, actionReport, equation, moveName, moveDescription, outcome, failGif) => {

  return outcomeEmbed = {
    title: actionReport,
    description: equation,
    color: color,
    //image: failGif,
    fields: [
      {
        name: moveName,
        value: moveDescription
      },
      {
        name: outcome.title,
        value: outcome.description
      }
    ],
  };

}

module.exports = { createOutcomeEmbed, rollOutcomeEmbed };
