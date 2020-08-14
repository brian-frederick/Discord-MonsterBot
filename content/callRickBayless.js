const crbQuestions = ` - Where are they now?\n`
+ ` - What happens here?\n`
+ ` - What's about to happen?\n`
+ ` - Who should I look for?\n`
+ ` - Where should I go?\n`
+ ` - What does the arcane almanac say?\n`;

const crb = {
  name: 'call Rick Bayless',
  action: 'called Rick Bayless',
  modifier: 'sharp',
  outcome: {
    fail: {
      title: 'On a failure',
      description: 'You make an attention-attracting fail.',
      image: {
        url: 'https://media.giphy.com/media/lgcUUCXgC8mEo/giphy.gif'
      },
      footer: {
        text: `Maaaarrk that experience.`
      }
    },
    success: {
      title: 'On a 7-9 Call Rick Bayless, hold 1.',
      description: `One hold can be spent to ask Rick Bayless one of the following questions:\n` + crbQuestions
    },
    high: {
      title: 'On a 10+ Call Rick Bayless, hold 2',
      description: `Hold 2. One hold can be spent to ask Rick Bayless one of the following questions:\n` + crbQuestions
    },
    advanced: {
      title: 'On a 12+ Call Rick Bayless',
      description: `You may ask Rick Bayless any question you want about the mystery, not just the listed ones.\n` + crbQuestions
    }
  }
};

module.exports = { crb };