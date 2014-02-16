var EnvelopeGenerator = require("./envelope_generator")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var model = function(buffer, region, noteOn, audioContext){
  this.amp = audioContext.createGainNode()
  this.ampeg = new EnvelopeGenerator({
    context: audioContext,
    delay: region.ampeg_delay,
    start: region.ampeg_start,
    attack: region.ampeg_attack,
    hold: region.ampeg_hold,
    decay: region.ampeg_decay,
    sustain: region.ampeg_sustain,
    release: region.ampeg_release,
    depth: 100
  })
  this.ampeg.connect(this.amp.gain)

  this.sourceNode = audioContext.createBufferSource()
  this.sourceNode.buffer = buffer

  var playbackRate = pitchToFreq(noteOn.pitch) / pitchToFreq(region.pitch_keycenter)
  this.sourceNode.playbackRate.value = playbackRate

  this.sourceNode.connect(this.amp)
}

model.prototype.start = function(){
  this.ampeg.trigger()
  this.sourceNode.start(0)
}

model.prototype.stop = function(){
  this.ampeg.triggerRelease()
}

model.prototype.connect = function(destination, output){
  this.amp.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.amp.disconnect(output)
}

module.exports = model
