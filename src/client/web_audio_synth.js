var BufferLoader = require("./buffer_loader")

WebAudioSynth = function(instrument, audioContext){
  this.context = audioContext
  var sampleUrls = instrument.samples()
  this.loadBuffers(sampleUrls)
}

WebAudioSynth.prototype.loadBuffers = function(urls){
  console.log("loading ", urls.length, "samples")
  var loader = new BufferLoader(urls, this.onBuffersLoaded.bind(this), this.context)
  loader.load()
}

WebAudioSynth.prototype.onBuffersLoaded = function(buffers){
  console.log("all buffers loaded!", buffers.length)
  this.buffers = buffers
}

module.exports = WebAudioSynth
