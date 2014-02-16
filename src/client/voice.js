
var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var model = function(buffer, region, noteOn, audioContext){
  //console.log("new voice", buffer, noteOn.pitch, region)
  this.gainNode = audioContext.createGainNode()
  this.gainNode.gain.value = .5
  this.sourceNode = audioContext.createBufferSource()
  this.sourceNode.buffer = buffer

  var playbackRate = pitchToFreq(noteOn.pitch) / pitchToFreq(region.pitch_keycenter)
  this.sourceNode.playbackRate.value = playbackRate
  console.log(noteOn.pitch, region.pitch_keycenter, playbackRate)

  this.sourceNode.connect(this.gainNode)
}

model.prototype.start = function(){
  this.sourceNode.start(0)
}

model.prototype.stop = function(){
  console.log("stopping")
  this.sourceNode.stop(0)
}

model.prototype.connect = function(destination, output){
  this.gainNode.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.gainNode.disconnect(output)
}

module.exports = model
