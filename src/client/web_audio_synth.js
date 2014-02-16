var BufferLoader = require("./buffer_loader")
  , Voice = require("./voice")
  , _ = require("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
  var sampleUrls = instrument.samples()
  this.loadBuffers(sampleUrls)
  this.voicesToRelease = {}
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

  if (noteOn.velocity != 0) {
    var voice = new Voice(buffer, region, noteOn, this.context)
    if (region.trigger == "attack") {
      this.voicesToRelease[noteOn.pitch] = voice
    }
    voice.connect(this.context.destination)
    voice.start()
  } else {

    var voice = this.voicesToRelease[noteOn.pitch]
    if (voice) voice.stop()
  }
}

module.exports = player
