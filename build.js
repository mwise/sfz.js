var sfz = require('./src/sfz')
  , AjaxLoader = require("./src/client/ajax_loader")

sfz.WebAudioSynth = require("./src/client/web_audio_synth")

sfz.load = function(audioContext, url, callback){
  var self = this
  AjaxLoader.load(url, function(str){
    var instrument = self.parse(str, sfz.WebAudioSynth, audioContext)
    callback(instrument)
  })
}

module.exports = sfz
