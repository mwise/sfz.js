var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var Amplifier = function(opts){
  this.input = opts.context.createGainNode()
  this.output = opts.context.createGainNode()
  this.input.connect(this.output)

  var db = -20 * Math.log(Math.pow(127, 2) / Math.pow(opts.velocity, 2))
    , noteGainAdj = (opts.pitch - opts.keycenter) * opts.keytrack

  db = db + noteGainAdj

  var velGainAdj = (opts.veltrack / 100.0) * opts.velocity / 127.0
    , gain = Math.pow(10, (db / 20.0 )) * 1.0

  gain = gain + (gain * velGainAdj)

  this.input.gain.value = gain

  this.ampeg = new EnvelopeGenerator({
    context: opts.context,
    delay: opts.eg_delay,
    start: opts.eg_start,
    attack: opts.eg_attack,
    hold: opts.eg_hold,
    decay: opts.eg_decay,
    sustain: opts.eg_sustain,
    release: opts.eg_release,
    depth: 100
  }, { pitch: opts.pitch, velocity: opts.velocity })
  this.ampeg.connect(this.output.gain)
}

Amplifier.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Amplifier.prototype.trigger = function(){
  this.ampeg.trigger()
}

Amplifier.prototype.triggerRelease =  function(){
  this.ampeg.triggerRelease()
}

module.exports = Amplifier
