function checkAllArgs(args, check) {
  
  for (let i = 0; i < args.length; i++) {
    let result = check(args[i]);
    if (result) {
      return result;
    }
  }

  return;
}

function parseUpdateProperty(args) {
  const key = checkAllArgs(args, parseHunterProperty);

  if (!key) {
    return;
  }

  const value = checkAllArgs(args, parseNumber);

  return {
    key,
    value: value ? value : 1
  };

}

function parseNumber(arg) {
  if (!isNaN(arg)) {
    return parseInt(arg);
  }
}

function parseHunterProperty(arg) {
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

module.exports = { checkAllArgs, parseUserIdFromMentionParam, parseUpdateProperty };
