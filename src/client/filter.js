var _ = require("underscore")

var FILTER_TYPES = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "peaking",
  "notch",
  "allpass"
]

//TODO - update this for 1-pole filters when the web audio API
 //makes the filter coefficients available
var filter_map = {
  "lpf_1p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_1p": FILTER_TYPES.indexOf("highpass"),
  "lpf_2p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_2p": FILTER_TYPES.indexOf("highpass"),
  "bpf_2p": FILTER_TYPES.indexOf("bandpass"),
  "brf_2p": FILTER_TYPES.indexOf("notch")
}

var defaults = {
  type: "lpf_2p",
  cutoff: null,
  cutoff_chanaft: 0,
  cutoff_polyaft: 0,
  resonance: 0,
  keytrack: 0,
  keycenter: 60,
  veltrack: 0,
  random: 0
}

var Filter = function(opts, noteOn){
  this.numberOfInputs = 1
  this.numberOfOutputs = 1
  this.channelCount = 2
  this.channelCountMode = "max"
  this.channelInterpretation = "speakers"

  opts.type = filter_map[opts.type]
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  var noteCutoffAdj = (noteOn.pitch - this.keycenter) * this.keytrack
    , velCutoffAdj = this.veltrack * noteOn.velocity / 127
    , cutoffAdj = noteCutoffAdj + velCutoffAdj

  this.frequency.value = this.cutoff + cutoffAdj
  this.Q.value = this.resonance
}

var FilterFactory = function(opts, noteOn){
  var filter = opts.context.createBiquadFilter()
  Filter.call(filter, opts, noteOn)

  return filter
}

module.exports = FilterFactory
