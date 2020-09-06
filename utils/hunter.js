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

module.exports = { statsEmbed };
