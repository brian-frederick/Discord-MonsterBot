
  
  const ksa =  {
    name: 'kick some ass',
    action: 'kicked some ass',
    modifier: 'tough',
    outcome: {
      success: 'On a 7+, you and whatever you’re fighting inflict harm on each other. The amount of harm is based on the established dangers in the game. That usually means you inflict the harm rating of your weapon and your enemy inflicts their attack’s harm rating on you.',
      high: `On a 10+, choose one extra effect:\n - You gain the advantage: take +1 forward, or give +1 forward to another hunter.\n`
        + ` - You inflict terrible harm (+1 harm).\n`
        + ` - You suffer less harm (-1 harm).\n`
        + ` - You force them where you want them.`,
      advanced: `advanced: On a 12+ instead pick an enhanced effect:\n` 
        + ` - You completely hold the advantage. All hunters involved in the fight get +1 forward.\n`
        + ` - You suffer no harm at all.\n`
        + ` - Your attack inflicts double the normal harm.\n`
        + ` - Your attack drives the enemy away in a rout.`
    }
  }

module.exports = { ksa };
