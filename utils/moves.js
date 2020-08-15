
const iamQuestions = ` - What happened here?\n`
+ ` - What sort of creature is it?\n`
+ ` - What can it do?\n`
+ ` - What can hurt it\n`
+ ` - Where did it go?\n`
+ ` - What was it going to do?\n`
+ ` - What is being concealed here?`;

const rabsQuestions = ` - What's my best way in?\n`
+ ` - What's my best way out?\n`
+ ` - Are there any dangers we haven't noticed?\n`
+ ` - What's the biggest threat?\n`
+ ` - What's most vulnerable to me?\n`
+ ` - What's the best way to protect the victims\n`
+ `If you act on the answers, you get +1 ongoing while the information is relevant.`;

const umEffects = ` - Inflict harm (1-harm ignore- armour magic obvious).\n`
  + ` - Enchant a weapon. It gets +1 harm and +magic.\n`
  + ` - Do one thing that is beyond human limitations.\n`
  + ` - Bar a place or portal to a specific person or a type of creature.\n`
  + ` - Trap a specific person, minion, or monster.\n`
  + ` - Banish a spirit or curse from the person, object, or place it inhabits.\n`
  + ` - Summon a monster into the world.\n`
  + ` - Communicate with something that you do not share a language with.\n`
  + ` - Observe another place or time.\n`
  + ` - Heal 1-harm from an injury, or cure a disease, or neutralize a poison.\n`;

const umGlitches =  ` - The effect is weakened.\n`
  + ` - The effect is of short duration.\n`
  + ` - You take 1-harm ignore-armour.\n`
  + ` - The magic draws immediate, unwelcome attention.\n`
  + ` - It has a problematic side effect.\n`;

const umKeeperMaySay = ` - The spell requires weird materials.\n`
  + ` - The spell will take 10 seconds, 30 seconds, or 1 minute to cast.\n`
  + ` - The spell requires ritual chanting and gestures.\n`
  + ` - The spell requires you to draw arcane symbols.\n`
  + ` - You need one or two people to help cast the spell.\n`
  + ` - You need to refer to a tome of magic for the details.\n`;

const umFields = [
  {
    name: 'Effects',
    value: umEffects
  },
  {
    name: 'Glitches',
    value: umGlitches
  },
  {
    name: 'The Keeper may say that...',
    value: umKeeperMaySay
  }
];

const ksa =  {
  name: 'kick some ass',
  action: 'kicked some ass',
  modifier: 'tough',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif'
      }
    },
    success: {
      title: 'On a 7+ Kick Some Ass...',
      description: 'You and whatever you’re fighting inflict harm on each other. The amount of harm is based on the established dangers in the game. That usually means you inflict the harm rating of your weapon and your enemy inflicts their attack’s harm rating on you.',
    },
    high: {
      title: 'On a 10+ Kick Some Ass, choose one extra effect:',
      description: `- You gain the advantage: take +1 forward, or give +1 forward to another hunter.\n`
      + ` - You inflict terrible harm (+1 harm).\n`
      + ` - You suffer less harm (-1 harm).\n`
      + ` - You force them where you want them.`,
    },
    advanced: {
      title: 'On a 12+ Kick Some Ass, pick an enhanced effect:',
      description: ` - You completely hold the advantage. All hunters involved in the fight get +1 forward.\n`
      + ` - You suffer no harm at all.\n`
      + ` - Your attack inflicts double the normal harm.\n`
      + ` - Your attack drives the enemy away in a rout.`
    }
  }
};

const aup = {
  name: 'act under pressure',
  action: 'acted under pressure',
  modifier: 'cool',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/Dc1w8y69enroY/giphy.gif'
      }
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
  name: 'help out',
  action: 'helped out',
  modifier: 'cool',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif'
      }
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
  name: 'investigate a mystery',
  action: 'investigated a mystery',
  modifier: 'sharp',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/10hO9c6zalcju/giphy.gif'
      }
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
  name: 'manipulate someone',
  action: 'manipulated someone',
  modifier: 'charm',
  outcome: {
    fail: {
      title: 'On a Failed Manipulate Somone...',
      description: `For charming another hunter, it's up to that hunter to decide how badly you offend or annoy them. They mark experience if they decide not to do what you ask. Monsters and minions cannot normally be manipulated.`,
      image: {
        url: 'https://media.giphy.com/media/kDmsG1ei4P1Yc/giphy-downsized.gif'
      }
    },
    success: {
      title: 'On a 7-9 Manipulate Somone...',
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
  name: 'protect someone',
  action: 'protected someone',
  modifier: 'tough',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/b5XRfyjS2xva0/giphy.gif'
      }
    },
    success: {
      title: 'On a 7-9 Protect Someone...',
      description: 'You protect them okay, but you’ll suffer some or all of the harm they were going to get.'
    },
    high: {
      title: 'On a 10+ Protect Someone...',
      description: `Choose an extra:\n`
        + ` - You suffer little harm (-1 harm).\n`
        + ` - All impending danger is now focused on you.\n`
        + ` - You inflict harm on the enemy.\n`
        + ` - You hold the enemy back.`
    },
    advanced: {
      title: 'On a 12+ Protect Somone...',
      description: 'Both you and the character you are protecting are unharmed and out of danger. If you were protecting a bystander, they also become your ally.'
    }
  }
};

const rabs = {
  name: 'read a bad situation',
  action: 'read a bad situation',
  modifier: 'sharp',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/UXSB8HYbpLQNq/giphy.gif'
      }
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
      description: 'You may ask the Keeper any question you want about the situation, not just the listed ones.',
      fields: [
        {
          name: 'standard questions',
          value: rabsQuestions
        }      
      ]
    }
  }
};

const um = {
  name: 'use magic',
  action: 'used magic',
  modifier: 'weird',
  outcome: {
    fail: {
      image: {
        url: 'https://media.giphy.com/media/myuLckXB7OjfGw1gSb/giphy-downsized.gif'
      }
    },
    success: {
      title: 'On a 7-9 Use Magic...',
      description: 'It works imperfectly: choose your effect and a glitch. The Keeper will decide what effect the glitch has.',
      fields: umFields
    },
    high: {
      title: 'On a 10+ Use Magic...',
      description: 'The magic works without issues: choose your effect.',
      fields: umFields
    },
    advanced: {
      title: 'On a 12+...',
      description: 'The Keeper will offer you some added benefit.',
      fields: umFields
    }
  }
};

module.exports = { ksa, aup, ho, iam, ms, ps, rabs, um };
