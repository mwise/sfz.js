var EnvelopeGenerator = require("./envelope_generator")
  , Filter = require("./filter")
  , BufferSource = require("./buffer_source")

var model = function(buffer, region, noteOn, audioContext){
  this.audioContext = audioContext

  this.output = audioContext.createGainNode()

  this.setupSource(buffer, region, noteOn)
  this.setupAmp(region, noteOn)
  this.setupFilter(region, noteOn)

  if (this.filter) {
    this.source.connect(this.filter)
    this.filter.connect(this.preamp)
  } else {
    this.source.connect(this.preamp)
  }

  this.amp.connect(this.output)
}

model.prototype.setupSource = function(buffer, region, noteOn){
  this.source = new BufferSource({
    context: this.audioContext,
    buffer: buffer,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.pitch_keycenter,
    keytrack: region.pitch_keytrack,
    transpose: region.transpose,
    tune: region.tune,
    veltrack: region.pitch_veltrack
  })
}

model.prototype.setupAmp = function(region, noteOn){
  var db = -20 * Math.log(Math.pow(127, 2) / Math.pow(noteOn.velocity, 2))
    , noteGainAdj = (noteOn.pitch - region.amp_keycenter) * region.amp_keytrack

  db = db + noteGainAdj

  var velGainAdj = (region.amp_veltrack / 100.0) * noteOn.velocity / 127.0
    , gain = Math.pow(10, (db / 20.0 )) * 1.0

  gain = gain + (gain * velGainAdj)

  this.preamp = this.audioContext.createGainNode()
  this.preamp.gain.value = gain

  this.amp = this.audioContext.createGainNode()

  this.preamp.connect(this.amp)

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
  }, noteOn)
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
