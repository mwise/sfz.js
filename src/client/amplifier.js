var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")
  , LFO = require("./lfo")
  , Signal = require("./signal")
  , AudioMath = require("./audio_math")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var Amplifier = function(opts){
  this.context = opts.context
  this.input = opts.context.createGainNode()
  this.output = opts.context.createGainNode()
  this.input.connect(this.output)

  var depth = AudioMath.dbToGain(opts.lfo_depth)

  this.lfo = new LFO({
    context: opts.context,
    delay: opts.lfo_delay,
    fade: opts.lfo_fade,
    freq: opts.lfo_freq,
    hold: opts.lfo_hold,
    depth: depth,
    depthchanaft: opts.lfo_depthchanaft,
    depthpolyaft: opts.lfo_depthpolyaft,
    freqchanaft: opts.lfo_freqchanaft,
    freqpolyaft: opts.lfo_freqpolyaft
  })

  var db = -20 * Math.log(Math.pow(127, 2) / Math.pow(opts.velocity, 2))
    , noteGainAdj = (opts.pitch - opts.keycenter) * opts.keytrack

  db = db + noteGainAdj

  var velGainAdj = (opts.veltrack / 100.0) * opts.velocity / 127.0
    , gain = AudioMath.dbToGain(db)

  gain = gain + (gain * velGainAdj)

  var gainSignal = new Signal({
    context: opts.context,
    value: gain
  })
  gainSignal.connect(this.input.gain)
  gainSignal.start()
  this.lfo.connect(this.input.gain)

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
  this.lfo.start()
  this.ampeg.trigger()
}

Amplifier.prototype.triggerRelease =  function(){
  this.ampeg.triggerRelease()
}

module.exports = Amplifier
