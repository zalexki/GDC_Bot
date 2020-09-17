const MersenneTwister = require("mersenne-twister");

const randomGenerator = new MersenneTwister();

exports.clamp = (value, min, max) => Math.max(Math.min(value, max), min);
exports.RollDice = (diceFace) =>
  Math.floor(randomGenerator.random() * diceFace + 1);
