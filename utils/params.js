function checkAllArgs(args, check) {
  
  for (let i = 0; i < args.length; i++) {
    let result = check(args[i]);
    if (result) {
      return result;
    }
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

module.exports = { checkAllArgs, parseUserIdFromMentionParam };