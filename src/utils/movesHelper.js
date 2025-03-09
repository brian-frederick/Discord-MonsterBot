const { hexColors } = require('../content/theme');
import moves from './moves';

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

  return {
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

const createInfoEmbed = (moveContext) => {
  let moveEmbed = {
    title: moveContext.name,
    description: '',
    fields: [],
    url: '',
  };

  const secondaryContext = (moveContext.type === 'modification') ?
    moves[moveContext.moveToModify] :
    null;

  moveEmbed.description = infoDescription(moveContext, secondaryContext)

  moveEmbed.fields = (moveContext.type === 'roll') ?
    infoOutcomeFields(moveContext.outcome) :
    null;

  // TODO: Remove the url once we takedown monsterbot.io
  if (moveContext.guildId) {
    moveEmbed.url = `https://www.monsterbot.io/moves/show/${moveContext.key}/guild/${moveContext.guildId}`;
  }

  return moveEmbed;
};


const infoOutcomeFields = (outcome) => {
  let fields = [];

  if (outcome.success && outcome.success.description) {
    fields.push(
      {
        name: 'On a 7-9...',
        value: outcome.success.description
      }
    );
  }

  // add high success outcome
  if (outcome.high && outcome.high.description) {
    fields.push(
      {
        name: 'On a 10-12...',
        value: outcome.high.description
      }
    );
  }

  // add advanced outcome
  if (outcome.advanced && outcome.advanced.description) {
    fields.push(
      {
        name: 'On a 12+...',
        value: outcome.advanced.description
      }
    );
  }

  // add fail outcome
  if (outcome.fail && outcome.fail.description) {
    fields.push(
      {
        name: 'On a miss...',
        value: outcome.fail.description
      }
    );
  }

  return fields;
}

const infoDescription = (moveContext, secondaryContext) => {
  let description = moveContext.key ? `\`/${moveContext.key}\`\n` : '';

  if (secondaryContext) {
    description+= `Modifies ${secondaryContext.name}\n`;
  }

  if (moveContext.description && moveContext.modifiers) {
    description += `${moveContext.description}\n \nModifiers: ${modifierList(moveContext.modifiers)} \n`
  } else if (moveContext.modifiers) {
    description += `modifier: ${moveContext.modifiers[0].property}`;
  } else if (moveContext.description) {
    description += moveContext.description;
  }

  return description;
}

const modifierInfo = (mod) => {
  const mathType = mod.plus ? '+' : '-';
  if (mod.type === 'property') {
    return `${mathType} ${mod.property}`;
  }
  if (mod.type === 'extra') {
    return `${mathType} ${mod.value} extra`;
  }
}

const modifierList = (modifiers) => modifiers.reduce(
  (acc, mod) => {
    return `${acc} \n ${modifierInfo(mod)}`
  },''
);

module.exports = { createOutcomeEmbed, createInfoEmbed, rollOutcomeEmbed, infoOutcomeFields, infoDescription };
