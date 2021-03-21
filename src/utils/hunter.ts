import { Hunter, CustomProp } from '../interfaces/Hunter';

export const someHunter = {
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

export function statsEmbed(hunter) {
  let embed = {};

  const fields = [
    {
      name: `:heart: ${hunter.harm}   :four_leaf_clover: ${hunter.luck}   :military_medal:${hunter.experience}`,
      inline: false,
      value: `Charm: ${hunter.charm}\n`
      + `Cool: ${hunter.cool}\n`
      + `Sharp: ${hunter.sharp}\n`
      + `Tough: ${hunter.tough}\n`
      + `Weird: ${hunter.weird}\n`, 
    }
  ];

  // handle custom props
  if (hunter.customProps && hunter.customProps.length > 0) {
    let customPropsText = '';
    hunter.customProps.forEach(cp => customPropsText += `${cp.key}: ${cp.value}\n`);
    fields.push({ name: 'Other', inline: false, value: customPropsText });
  }

  // handle advanced moves
  if (hunter.advancedMoves && hunter.advancedMoves.length > 0) {
    let moveString = '';
    hunter.advancedMoves.forEach(move => moveString += ` - ${move.value} (${move.key})\n`);
    fields.push({name: 'Advanced Moves', inline: false, value: moveString});
  }

  embed = {
    color: 0x0099ff,
    title: `${hunter.firstName} ${hunter.lastName}`,
    description: `${hunter.type}\n`,
    fields: fields
  };

  return embed;
};

export function updateCustomProps(hunter: Hunter, key, value): CustomProp[] | void {
  if (hunter.customProps && hunter.customProps.length > 0) {
    const i = hunter.customProps.findIndex(cp => cp.key === key);
    if (i > -1) {
      hunter.customProps[i].value = value;
      return hunter.customProps;
    }
  } 

  // if there are no custom props, or we don't have the requested prop, just return void
  return;
}

export function isMoveAdvanced(key, advancedMoves) {
  return advancedMoves
    && advancedMoves.length > 0
    && advancedMoves.findIndex(am => am.key === key) > -1;
}
