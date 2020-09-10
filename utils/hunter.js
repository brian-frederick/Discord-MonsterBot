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
}

function statsEmbed(hunter) {
  return {
    color: 0x0099ff,
    title: `${hunter.firstName} ${hunter.lastName}`,
    description: `${hunter.type}\n`,
    fields: [
      {
        name: `:heart: ${hunter.harm}   :four_leaf_clover: ${hunter.luck}   :military_medal:${hunter.experience}`,
        value: `Charm: ${hunter.charm}\n`
        + `Cool: ${hunter.cool}\n`
        + `Sharp: ${hunter.sharp}\n`
        + `Tough: ${hunter.tough}\n`
        + `Weird: ${hunter.weird}\n`, 
      }
    ]
  }
};

module.exports = { statsEmbed, someHunter };
