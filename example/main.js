var pianoSynth = sfz.load("/example/piano.sfz", function(synth){
  console.log("loaded sfz synth", synth)
})

var midiSelect = new MIDISelect()

midiSelect.on("noteOn", function(e){
  console.log(e.detail)
})

midiSelect.on("controlChange", function(e){
  console.log(e.detail)
})

midiSelect.on("pitchBend", function(e){
  console.log(e.detail)
})
