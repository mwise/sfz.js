var EnvelopeGenerator = require("./envelope_generator")
  , Filter = require("./filter")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var model = function(buffer, region, noteOn, audioContext){
  this.audioContext = audioContext

  this.output = audioContext.createGainNode()

  this.setupSource(buffer, region, noteOn)
  this.setupAmp(region, noteOn)
  this.setupFilter(region, noteOn)

  if (this.filter) {
    this.source.connect(this.filter)
    this.filter.connect(this.amp)
  } else {
    this.source.connect(this.amp)
  }

  this.amp.connect(this.output)
}

model.prototype.setupSource = function(buffer, region, noteOn){
  this.source = this.audioContext.createBufferSource()
  this.source.buffer = buffer
  var noteFreq = pitchToFreq(noteOn.pitch) * Math.pow((Math.pow(2, 1/1200)), region.tune)
    , playbackRate = noteFreq / pitchToFreq(region.pitch_keycenter)

  this.source.playbackRate.value = playbackRate
}

model.prototype.setupAmp = function(region, noteOn){
  this.amp = this.audioContext.createGainNode()
  this.ampeg = new EnvelopeGenerator({
    context: this.audioContext,
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
}

model.prototype.setupFilter = function(region, noteOn){
  if (!region.cutoff) return;

  this.filter = new Filter({
    context: this.audioContext,
    type: region.fil_type,
    cutoff: region.cutoff,
    cutoff_chanaft: region.cutoff_chanaft,
    cutoff_polyaft: region.cutoff_polyaft,
    resonance: region.resonance,
    keytrack: region.fil_keytrack,
    keycenter: region.fil_keycenter,
    veltrack: region.fil_veltrack,
    random: region.fil_random
  }, noteOn)
}

model.prototype.start = function(){
  this.ampeg.trigger()
  this.source.start(0)
}

model.prototype.stop = function(){
  this.ampeg.triggerRelease()
}

model.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.amp.disconnect(output)
}

module.exports = model
