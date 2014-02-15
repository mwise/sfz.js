var  Region = require("./region")
  , NullSynth = require("./null_synth")
  , _ = require("underscore")

model = function(opts){
  opts = opts || {}
  opts.regions = opts.regions || []

  this.regions = _(opts.regions).map(function(regionDefinition){
    return new Region(regionDefinition)
  })

  this.bend = 0
  this.chanaft = 64
  this.polyaft = 64
  this.bpm = 120

  this.synth = opts.synth || new NullSynth()
}

model.prototype.shouldPlayRegion = function(region, noteOn, rand){
  return region.sample != null &&
    region.lochan <= noteOn.channel &&
    region.hichan >= noteOn.channel &&
    region.lokey <= noteOn.pitch &&
    region.hikey >= noteOn.pitch &&
    region.lovel <= noteOn.velocity &&
    region.hivel >= noteOn.velocity &&
    region.lobend <= this.bend &&
    region.hibend >= this.bend &&
    region.lochanaft <= this.chanaft &&
    region.hichanaft >= this.chanaft &&
    region.lopolyaft <= this.polyaft &&
    region.hipolyaft >= this.polyaft &&
    region.lorand <= rand &&
    region.hirand >= rand &&
    region.lobpm <= this.bpm &&
    region.hibpm >= this.bpm
}

model.prototype.regionsToPlay = function(noteOn, rand){
  var self = this
  return _(this.regions).filter(function(region){
    return self.shouldPlayRegion(region, noteOn, rand)
  })
}

model.prototype.random = function(){
  return Math.random()
}

model.prototype.noteOn = function(channel, pitch, velocity){
  var rand = this.random()
  var noteOn = {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }
  _(this.regionsToPlay(noteOn, rand)).each(function(region){
    this.play(region, noteOn)
  }.bind(this))
}

model.prototype.play = function(region, noteOn){
  this.synth.play(region, noteOn)
}

module.exports = model
