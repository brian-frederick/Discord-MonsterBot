function printInventory(firstName, inventory) {
  if (inventory.length > 0) {
    let inventoryString = '';
    inventory.forEach(item => inventoryString += ` - ${item} \n`);
    return { 
      embed: { 
        title: `${firstName}'s Inventory:`,
        description: inventoryString
      }
    };
  }
  else {
    return `${firstName}'s inventory is empty`;
  }
}

function removeItem(item, inventory) {
  const i = inventory.findIndex(i => i === item);
  inventory.splice(i, 1);
}

module.exports = { printInventory, removeItem };
