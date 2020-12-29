const Discord = require('discord.js');

const someHunter = {
  "charm": 0,
  "cool": 0,
  "experience": 0,
  "firstName": "Some Hunter",
  "harm": 0,
  "inventory": [],
  "lastName": "",
  "luck": 0,
  "sharp": 0,
  "tough": 0,
  "type": "Other",
  "userId": "1",
  "weird": 0
};

function statsEmbed(hunter) {
  let embed = new Discord.MessageEmbed();

  const fields = [
    {
      name: `:heart: ${hunter.harm}   :four_leaf_clover: ${hunter.luck}   :military_medal:${hunter.experience}`,
      value: `Charm: ${hunter.charm}\n`
      + `Cool: ${hunter.cool}\n`
      + `Sharp: ${hunter.sharp}\n`
      + `Tough: ${hunter.tough}\n`
      + `Weird: ${hunter.weird}\n`, 
    }
  ];

  // handle advanced moves
  if (hunter.advancedMoves && hunter.advancedMoves.length > 0) {
    let moveString = '';
    hunter.advancedMoves.forEach(move => moveString += ` - ${move.value} (${move.key})\n`);
    fields.push({name: 'Advanced Moves', value: moveString});
  }

  embed = {
    color: 0x0099ff,
    title: `${hunter.firstName} ${hunter.lastName}`,
    description: `${hunter.type}\n`,
    fields: fields
  };

  return embed;
};

function isMoveAdvanced(key, advancedMoves) {
  return advancedMoves
    && advancedMoves.length > 0
    && advancedMoves.findIndex(am => am.key === key) > -1;
}

module.exports = { statsEmbed, someHunter, isMoveAdvanced };
