function roll2d6() {

  const results = [];

  results.push(rollD6());
  results.push(rollD6());

  return results;
}

function makeOutcomeWithModifierArgs(results, args, modifierType='modifier'){

  let total = parseInt(results[0] + results[1]);

  console.log("BFTEST", total);
  const equation = '';

  if (args[0] === 'plus' && !isNaN(args[1])) {
    const mod = parseInt(args[1])
    total = total + mod;

    return {
      total: total,
      equation: `(${results[0]} + ${results[1]} + ${mod} (${modifierType}) = ${total})`
    };

   } else if (args[0] === 'minus' && !isNaN(args[1])) {
    const mod = parseInt(args[1])
    total = total - mod < 1 ? 1 : total - mod;
    return {
      total: total,
      equation: `(${results[0]} + ${results[1]} - ${mod} (${modifierType}) = ${total})`
    };
   } 
  
  return {
    total: total,
    equation: `(${results[0]} + ${results[1]} = ${total})`
  };


}


function makeEquationMessageWithModifierArgs(diceResults, args, modifierType='modifier') {


  if (args[0] === 'plus' && !isNaN(args[1])){
    const mod = parseInt(args[1])
    total = total + mod;
   } else if (args[0] === 'minus' && !isNaN(args[1])) {
    const mod = parseInt(args[1])
    total = total - mod < 1 ? 1 : total - mod;
   } else {
    return `(${results[0]} + ${results[1]} = ${total})`
   }

}


function subtractFromTotal(dice, modifier) {
  result = dice - modifier < 1 ? 1 : dice - modifier;
  return result;
}


function rollD6() {
  return Math.floor((Math.random() * 6) + 1);
}

module.exports = { roll2d6, makeOutcomeWithModifierArgs };
