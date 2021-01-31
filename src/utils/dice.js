function roll2d6() {

  const results = [];

  results.push(rollD6());
  results.push(rollD6());

  return results;
}

function roll(modifiers = []){

  const diceRolls = roll2d6();

  let total = parseInt(diceRolls[0] + diceRolls[1]);
  let equation = `(${diceRolls[0]} + ${diceRolls[1]})`;

  modifiers.forEach(mod => {
    total += mod.value;
    equation += ` + ${mod.value} (${mod.key})`;
  })

  equation += ` = ${total}`;
  
  return {
    total: total,
    equation: equation
  };
}

function subtractFromTotal(dice, modifier) {
  result = dice - modifier < 1 ? 1 : dice - modifier;
  return result;
}


function rollD6() {
  return Math.floor((Math.random() * 6) + 1);
}

module.exports = { roll };
