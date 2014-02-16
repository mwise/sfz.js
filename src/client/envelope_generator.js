var _ = require("underscore")

var defaults = {
  delay: 0,
  start: 0,
  attack: 0,
  hold: 0,
  decay: 0,
  release: 0,
  sustain: 100,
  depth: 100
}

var EnvelopeGenerator = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)
}

EnvelopeGenerator.prototype.trigger = function() {
  var now = this.context.currentTime
  var attackTime = now + this.attack
    , holdTime = attackTime + this.hold
    , decayTime = holdTime + this.decay
    , maxValue = this.depth / 100
    , sustainLevel = this.sustain / 100

  this.param.cancelScheduledValues(now)
  this.param.setValueAtTime(0, now)
  this.param.linearRampToValueAtTime(maxValue, attackTime)
  this.param.setValueAtTime(maxValue, holdTime)
  this.param.linearRampToValueAtTime(sustainLevel, decayTime)
}

EnvelopeGenerator.prototype.triggerRelease = function(){
  var now = this.context.currentTime
  this.param.setValueAtTime(this.param.value, now)
  this.param.linearRampToValueAtTime(0, now + this.release)
}

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param
}

module.exports = EnvelopeGenerator