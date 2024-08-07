
const iamQuestions = `- What happened here?\n`
+ `- What sort of creature is it?\n`
+ `- What can it do?\n`
+ `- What can hurt it\n`
+ `- Where did it go?\n`
+ `- What was it going to do?\n`
+ `- What is being concealed here?`;

const rabsQuestions = `- What's my best way in?\n`
+ `- What's my best way out?\n`
+ `- Are there any dangers we haven't noticed?\n`
+ `- What's the biggest threat?\n`
+ `- What's most vulnerable to me?\n`
+ `- What's the best way to protect the victims\n`
+ `If you act on the answers, you get +1 ongoing while the information is relevant.`;

const umEffects = `- Inflict harm (1-harm ignore- armour magic obvious).\n`
  + `- Enchant a weapon. It gets +1 harm and +magic.\n`
  + `- Do one thing that is beyond human limitations.\n`
  + `- Bar a place or portal to a specific person or a type of creature.\n`
  + `- Trap a specific person, minion, or monster.\n`
  + `- Banish a spirit or curse from the person, object, or place it inhabits.\n`
  + `- Summon a monster into the world.\n`
  + `- Communicate with something that you do not share a language with.\n`
  + `- Observe another place or time.\n`
  + `- Heal 1-harm from an injury, or cure a disease, or neutralize a poison.\n`;

const umGlitches =  `- The effect is weakened.\n`
  + `- The effect is of short duration.\n`
  + `- You take 1-harm ignore-armour.\n`
  + `- The magic draws immediate, unwelcome attention.\n`
  + `- It has a problematic side effect.\n`;

const umKeeperMaySay = `- The spell requires weird materials.\n`
  + `- The spell will take 10 seconds, 30 seconds, or 1 minute to cast.\n`
  + `- The spell requires ritual chanting and gestures.\n`
  + `- The spell requires you to draw arcane symbols.\n`
  + `- You need one or two people to help cast the spell.\n`
  + `- You need to refer to a tome of magic for the details.\n`;


const ksa =  {
  name: 'Kick Some Ass',
  description: 'Fighting something that is fighting back.',
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'tough' }],
  failGif: {
    url: 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'They’re in a lot of trouble. Harm, capture, losing the monster, or other bad things.',
    },
    success: {
      title: 'On a 7+ Kick Some Ass...',
      description: 'You and whatever you’re fighting inflict harm on each other. The amount of harm is based on the established dangers in the game. That usually means you inflict the harm rating of your weapon and your enemy inflicts their attack’s harm rating on you.',
    },
    high: {
      title: 'On a 10+ Kick Some Ass, choose one extra effect:',
      description: `- You gain the advantage: take +1 forward, or give +1 forward to another hunter.\n`
      + `- You inflict terrible harm (+1 harm).\n`
      + `- You suffer less harm (-1 harm).\n`
      + `- You force them where you want them.`,
    },
    advanced: {
      title: 'On a 12+ Kick Some Ass, pick an enhanced effect:',
      description: `- You completely hold the advantage. All hunters involved in the fight get +1 forward.\n`
      + `- You suffer no harm at all.\n`
      + `- Your attack inflicts double the normal harm.\n`
      + `- Your attack drives the enemy away in a rout.`
    }
  }
};

const aup = {
  name: 'Act Under Pressure',
  description: 'Trying to do something under conditions of particular stress or danger.',
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'cool' }],
  failGif: {
    url: 'https://media.giphy.com/media/KHJw9NRFDMom487qyo/giphy-downsized.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'The pressure has overwhelmed the hunter.',
    },
    success: {
      title: 'On a 7-9 Act Under Pressure...',
      description: 'The Keeper is going to give you a worse outcome, hard choice, or price to pay.'
    },
    high: {
      title: 'On a 10+ Act Under Pressure...',
      description: 'You do what you set out to do.',
    },
    advanced: {
      title: 'On a 12+ Act Under Pressure...',
      description: 'You may choose to either do what you wanted and something extra, or to do what you wanted with absolute perfection.'
    }
  }
};

const ho = {
  name: 'Help Out',
  description: 'When you help another hunter with a move they are making.',
  modifiers: [{ type: 'property', plus: true, property: 'cool' }],
  type: 'roll',
  failGif: {
    url: 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'The help does no good and the helper exposes themselves to trouble or danger.',
    },
    success: {
      title: 'On a 7-9 Help Out...',
      description: 'Your help grants them +1 to their roll, but you also expose yourself to trouble or danger.'
    },
    high: {
      title: 'On a 10+ Help Out...',
      description: 'Your help grants them +1 to their roll.',
    },
    advanced: {
      title: 'On a 12+...',
      description: 'On a 12+ your help lets them act as if they just rolled a 12 regardless of what they got.'
    }
  }
};

const iam = {
  name: 'Investigate A Mystery',
  description: `Investigating for more information about what's going on.`,
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'sharp' }],
  failGif: {
    url: 'https://media.giphy.com/media/10hO9c6zalcju/giphy.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'There\'s trouble with normal people or giving away information to their enemies.',
    },
    success: {
      title: 'On a 7-9 Investigate A Mystery...',
      description: `Hold 1. One hold can be spent to ask the Keeper one of the following questions:\n` + iamQuestions
    },
    high: {
      title: 'On a 10+ Investigate A Mystery...',
      description: `Hold 2. One hold can be spent to ask the Keeper one of the following questions:\n` + iamQuestions
    },
    advanced: {
      title: 'On a 12+ Investigate A Mystery',
      description: `You may ask the Keeper any question you want about the mystery, not just the listed ones.\n` + iamQuestions
    }
  }
};

const ms = {
  name: 'Manipulate Someone',
  description: `When you want someone to do something for you and they don't want to do it. To get them to do what you're asking, you'll need a good reason.`, 
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'charm' }],
  failGif: {
    url: 'https://media.giphy.com/media/kDmsG1ei4P1Yc/giphy-downsized.gif'
  },
  outcome: {
    fail: {
      title: 'On a Failed Manipulate Someone...',
      description: `Offends the target or comes across as obtuse or annoying. Targets may see through a disguise, or refuse to believe a critical lie (or truth!). If used on another hunter, they mark experience if they decide not to do what you ask.`,
    },
    success: {
      title: 'On a 7-9 Manipulate Someone...',
      description: `For charming a normal person:\n`
        + `They’ll do it, but only if you do something for them right now to show that you mean it. If you asked too much, they’ll tell you what, if anything, it would take for them to do it.\n`
        + '\n'
        + `For charming another hunter:\n`
        + `They mark experience if they do what you ask.`
    },
    high: {
      title: 'On a 10+ Manipulate Someone',
      description: `For charming a normal person:\n`
        + `They’ll do it for the reason you gave them. If you asked too much, they’ll tell you the minimum it would take for them to do it (or if there’s no way they’d do it).\n`
        + '\n'
        + `For charming another hunter:\n`
        + `If they do what you ask they mark experience and get +1 forward.`
    },
    advanced: {
      title: 'On a 12+ Manipulate Someone...',
      description: 'For charming a normal person:\n'
        + `Not only do they do what you want right now, they also become your ally for the rest of the mystery (or, if you do enough for them, permanently).\n`
        + '\n'
        + `For charming another hunter:\n`
        + `They must act under pressure to resist your request. If they do what you ask, they mark one experience and take +1 ongoing while doing what you asked.`
    }
  }
};

const ps = {
  name: 'Protect Someone',
  description: 'If someone is about to suffer harm and you can somehow prevent it.',
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'tough' }],
  failGif: {
    url: 'https://media.giphy.com/media/b5XRfyjS2xva0/giphy.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'Harm to the protector and protectee as well as a potential future hard move.',
    },
    success: {
      title: 'On a 7-9 Protect Someone...',
      description: 'You protect them okay, but you’ll suffer some or all of the harm they were going to get.'
    },
    high: {
      title: 'On a 10+ Protect Someone...',
      description: `Choose an extra:\n`
        + `- You suffer little harm (-1 harm).\n`
        + `- All impending danger is now focused on you.\n`
        + `- You inflict harm on the enemy.\n`
        + `- You hold the enemy back.`
    },
    advanced: {
      title: 'On a 12+ Protect Someone...',
      description: 'Both you and the character you are protecting are unharmed and out of danger. If you were protecting a bystander, they also become your ally.'
    }
  }
};

const rabs = {
  name: 'Read a Bad Situation',
  description: 'When you look around and read a bad situation, one hold can be spent to ask the keeper a question.',
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'sharp' }],
  failGif: {
    url: 'https://media.giphy.com/media/UXSB8HYbpLQNq/giphy.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'Hunters put themselves in harms way or accidentally give away information to their enemies.',
    },
    success: {
      title: 'On a 7-9 Read A Bad Situation...',
      description: `Hold 1. One hold can be spent to ask the following questions:\n` + rabsQuestions 
    },
    high: {
      title: 'On a 10+ Read A Bad Situation...',
      description: `Hold 3. One hold can be spent to ask the following questions:\n` + rabsQuestions
    },
    advanced: {
      title: 'On a 12+ Read A Bad Situation...',
      description: `You may ask the Keeper any question you want about the situation, not just these listed ones:\n` + rabsQuestions,
    }
  }
};

const um = {
  name: 'Use Magic',
  description: `Say what you're trying to achieve and how you do the spell.\n` +
  `\nThe keeper may require one or more of the following:\n` +
   umKeeperMaySay,
  type: 'roll',
  modifiers: [{ type: 'property', plus: true, property: 'weird' }],
  failGif: {
    url: 'https://media.giphy.com/media/myuLckXB7OjfGw1gSb/giphy-downsized.gif'
  },
  outcome: {
    fail: {
      title: 'On a miss...',
      description: 'Keeper makes as hard a move as they like. Reversing the effect, harm, overall weirdness - anything can happen when magic goes wrong.',
    },
    success: {
      title: 'On a 7-9...',
      description: `It works imperfectly: choose your effect and a glitch. The Keeper will decide the glitch.\n` +
        `\nEffects:\n` +
        umEffects +
        `\nGlitches:\n` + 
        umGlitches,
    },
    high: {
      title: 'On a 10+...',
      description: `The magic works without issues. Choose your effect.\n` +
      `\nEffects:\n` +
      umEffects,
    },
    advanced: {
      title: 'On a 12+...',
      description: `The Keeper will offer you some added benefit in addition to your chosen effect:\n` + 
      `\nEffects:\n` +
      umEffects,
    }
  }
};

module.exports = { ksa, aup, ho, iam, ms, ps, rabs, um };
