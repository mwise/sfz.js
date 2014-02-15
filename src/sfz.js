var sfz = {}
  , Parser = require("./parser")

sfz.Instrument = require("./instrument")

sfz.parse = function(str){
  var instrumentDefinition = Parser.parse(str)
  return new sfz.Instrument(instrumentDefinition)
}


module.exports = sfz
