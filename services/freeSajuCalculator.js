const { calculateSajuEngine } = require('./saju');

function calculateFreeSaju(input) {
  return calculateSajuEngine(input);
}

module.exports = { calculateFreeSaju };