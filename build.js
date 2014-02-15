var sfz = require('./src/sfz')
  , AjaxLoader = require("./src/client/ajax_loader")

sfz.WebAudioSynth = require("./src/client/web_audio_synth")

sfz.load = function(url, callback){
  var self = this
  AjaxLoader.load(url, function(str){
    console.log("loaded!!")
    var instrument = self.parse(str)
    callback(instrument)
  })
}

module.exports = sfz
