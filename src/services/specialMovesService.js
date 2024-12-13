const { takePriority, PUBLIC_GUILD_ID } = require('../utils/specialMovesHelper');
const { getSpecialMoves } = require('../utils/dynamodb');
const { get, create, getAll } = require('../db/moves');

// Checks both the public and specified guild.
async function getSpecialMove(key, guildId) {
  const keys = [
    {key: {S:key}, "guildId": {S:PUBLIC_GUILD_ID}},
  ];

  if (guildId) {
    keys.push({key: {S:key}, guildId:{S: guildId}});
  }

  const moves = await getSpecialMoves(keys);

  // If the move exists for this guild, take that.
  // Otherwise, take the public move.
  const priorityMove = takePriority(moves, guildId);

  return priorityMove;
};

async function getSpecialMoveV2(key, guildId) {
  return await get(guildId, key);
}

async function getAllSpecialMoves(guildId) {
  return await getAll(guildId);
}

async function createSpecialMove(key, guildId, move) {

  return await create(key, guildId, move);
}

module.exports = { createSpecialMove, getSpecialMove, getSpecialMoveV2, getAllSpecialMoves };
