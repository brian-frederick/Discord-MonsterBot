const moves =  require('../utils/moves');

function checkAllArgs(args, check) {
  
  for (let i = 0; i < args.length; i++) {
    let result = check(args[i]);
    if (result || result === 0) {
      return result;
    }
  }

  return;
}

function parseUpdateVital(args) {
  const key = checkAllArgs(args, parseHunterVital);

  if (!key) {
    return;
  }

  const value = checkAllArgs(args, parseNumber);

  return {
    key,
    value: value ? value : 1
  };

}

function parseUpdateProperty(args) {
  const key = checkAllArgs(args, parseHunterProperty);

  if (!key) {
    return;
  }

  const value = checkAllArgs(args, parseNumber);

  if (!value && value !== 0 ) {
    return;
  }

  return { key, value: value };
}

function parseNumber(arg) {
  if (!isNaN(arg)) {
    const val = parseInt(arg);
    return val;
  }

  return;
}

function parseAllForNumber(args) {
  return checkAllArgs(args, parseNumber);
}

function parseHunterVital(arg) {
  const hunterProperties = [
    'experience',
    'harm',
    'luck',
  ];

  if (hunterProperties.includes(arg)) {
    return arg;
  }

  if (arg === 'xp') {
    return 'experience';
  }

  return;
}

const addTypes = [
  'add',
  'plus',
  'put',
  '+'
];

const removeTypes = [
  'remove',
  'subtract',
  'sub',
  'minus',
  'take',
  '-'
];

function parseInventoryUpdate(args) {

  const type = checkAllArgs(args, parseInventoryUpdateType);

  // our item could be more than one word so we have to reconstruct.
  const inventoryItemDeconstructed = args.filter(arg => 
    !removeTypes.includes(arg) &&
    !addTypes.includes(arg) &&
    !isUserMention(arg)
  );
    
  const item = inventoryItemDeconstructed.join(' ');

  if (type && item) {
    return { type, item };
  }

  return null;

}

function parseInventoryUpdateType(arg) {

  if (addTypes.includes(arg)) return 'add';

  if (removeTypes.includes(arg)) return 'remove';

  return;
}

function isRemove(args) {
  return checkAllArgs(args, (arg) => {
    if (removeTypes.includes(arg)) return true;
  });
}

function parseHunterProperty(arg) {
  const hunterProperties = [
    'experience',
    'harm',
    'luck',
    'charm',
    'cool',
    'sharp',
    'tough',
    'weird'
  ];

  if (hunterProperties.includes(arg)) {
    return arg;
  }

  if (arg === 'xp') {
    return 'experience';
  }

  return;
}

function parseUserIdFromMentionParam(arg) {
  if (!arg) return;
  
	if (arg.startsWith('<@') && arg.endsWith('>')) {
		arg = arg.slice(2, -1);

		if (arg.startsWith('!')) {
			arg = arg.slice(1);
		}

		return arg;
  }

  return;
}

// be able to check for and remove any mentions
function isUserMention(arg) {
  if (arg.startsWith('<@') && arg.endsWith('>')) {
    return true;
  }
  return false;
}

function parseSpecialMoveKey(args) {
  
  const possibleMove = (arg) => {
    const mightBe = 
      !/[^a-zA-Z]/.test(arg) && 
      arg.length < 6 &&
      arg.length > 1;

      return (
        mightBe && 
        !removeTypes.includes(arg) && 
        !addTypes.includes(arg)
      ) ? arg : null;
  };

  return checkAllArgs(args, possibleMove);
}

function parseBasicMoveKey(args) {

  return checkAllArgs(args, (arg) => {
    if (moves[arg.toLowerCase()]) {
      return { key: arg.toLowerCase(), value: moves[arg.toLowerCase()].name }
    }
  });

}

module.exports = { 
  checkAllArgs,
  parseUserIdFromMentionParam,
  parseUpdateVital,
  parseUpdateProperty,
  parseSpecialMoveKey,
  parseAllForNumber,
  parseInventoryUpdate,
  parseBasicMoveKey,
  isRemove
};
