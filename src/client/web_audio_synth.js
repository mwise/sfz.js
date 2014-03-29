var BufferLoader = require("./buffer_loader")
  , Voice = require("./voice")
  , _ = require("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
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
  console.log("audio buffer loaded")
  var self = this
  this.buffers = {}

  _(this.samples).each(function(url, i){
    self.buffers[url] = buffers[i]
  })
}

player.prototype.play = function(region, noteOn){
  var buffer = this.buffers[region.sample]
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[noteOn.pitch] = voicesToRelease[noteOn.pitch] || []

  var voice = new Voice(buffer, region, noteOn, this.context, this.bend)
  self.activeVoices[voice.voiceId] = voice
  voice.onended = function(){
    delete self.activeVoices[voice.voiceId]
  }
  if (region.trigger == "attack") {
    voicesToRelease[noteOn.pitch].push(voice)
  }
  voice.connect(this.context.destination)
  voice.start()
}

player.prototype.stop = function(pitch){
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[pitch] = voicesToRelease[pitch] || []

  _(voicesToRelease[pitch]).each(function(voice){
    voice.stop()
  })
  voicesToRelease[pitch] = []
  //var voiceToRelase = voicesToRelease[noteOn.pitch][region.regionId]
  //if (voiceToRelase) voiceToRelase.stop()
  //voicesToRelease[noteOn.pitch][region.regionId] = null
}

player.prototype.pitchBend = function(channel, bend){
  _(this.activeVoices).invoke("pitchBend", bend)
  this.bend = bend
}

module.exports = player
