var BufferLoader = require("./buffer_loader")
  , Voice = require("./voice")
  , _ = require("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
  window.context = this.context
  var sampleUrls = _(instrument.samples()).uniq()
  this.loadBuffers(sampleUrls)
  this.voicesToRelease = {}
  this.activeVoices = window.voices = {}
  this.bend = 0
}

player.prototype.loadBuffers = function(urls){
  this.samples = urls
  urls = _(urls).map(function(url){ return encodeURIComponent(url) })
  var loader = new BufferLoader(urls, this.onBuffersLoaded.bind(this), this.context)
  loader.load()
}

player.prototype.onBuffersLoaded = function(buffers){
  var self = this
  this.buffers = {}

  _(this.samples).each(function(url, i){
    self.buffers[url] = buffers[i]
  })
}

player.prototype.play = function(region, noteOn){
  var buffer = this.buffers[region.sample]
  var self = this

  if (noteOn.velocity != 0) {
    var voice = new Voice(buffer, region, noteOn, this.context, this.bend)
    self.activeVoices[voice.voiceId] = voice
    voice.onended = function(){
      delete self.activeVoices[voice.voiceId]
    }
    if (region.trigger == "attack") {
      this.voicesToRelease[noteOn.pitch] = voice
    }
    voice.connect(this.context.destination)
    voice.start()
  } else {
    var voice = this.voicesToRelease[noteOn.pitch]
    if (voice) {
      voice.stop()
      delete this.voicesToRelease[noteOn.pitch]
    }
  }
}

player.prototype.pitchBend = function(channel, bend){
  _(this.activeVoices).invoke("pitchBend", bend)
  this.bend = bend
}

module.exports = player
