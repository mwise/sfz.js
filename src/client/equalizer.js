var _ = require("underscore")

var defaults = {
  freq1: 50,
  freq2: 500,
  freq3: 5000,
  bw1: 1,
  bw2: 1,
  bw3: 1,
  gain1: 0,
  gain2: 0,
  gain3: 0,
  vel2gain1: 0,
  vel2gain2: 0,
  vel2gain3: 0,
  velocity: 0
}

var bwToQ = function(bw){
  var x = Math.pow(2, bw)
  return Math.sqrt(x) / (x - 1)
}

var Equalizer = function(opts){
  _.defaults(opts, defaults)

  this.input = this.eq1 = opts.context.createBiquadFilter()
  this.eq2 = opts.context.createBiquadFilter()
  this.output = this.eq3 = opts.context.createBiquadFilter()

  this.input.connect(this.eq2)
  this.eq2.connect(this.output)

  // All of these are "peaking"-type filters
  this.eq1.type = 5
  this.eq2.type = 5
  this.eq3.type = 5

  this.eq1.frequency.value = opts.freq1
  this.eq2.frequency.value = opts.freq1
  this.eq3.frequency.value = opts.freq1

  this.eq1.Q.value = bwToQ(opts.bw1)
  this.eq2.Q.value = bwToQ(opts.bw2)
  this.eq3.Q.value = bwToQ(opts.bw3)

  var velFactor = opts.velocity / 127

  this.eq1.gain.value = opts.gain1 + opts.vel2gain1 * velFactor
  this.eq2.gain.value = opts.gain2 + opts.vel2gain2 * velFactor
  this.eq3.gain.value = opts.gain3 + opts.vel2gain3 * velFactor
}

Equalizer.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Equalizer.prototype.disconnect = function(output){
  this.output.disconnect(output)
}

Equalizer.prototype.destroy = function(){
  this.disconnect()
}

module.exports = Equalizer
