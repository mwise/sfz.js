var midiSelect = new MIDISelect()
var ac = new webkitAudioContext()

sfz.load(ac, "/example/piano.mp3.sfz", function(synth){
  console.log("loaded sfz synth", synth)

  midiSelect.on("noteOn", function(e){
    synth.noteOn(e.detail.channel, e.detail.pitch, e.detail.velocity)
  })

  midiSelect.on("controlChange", function(e){
    console.log(e.detail)
  })

  midiSelect.on("pitchBend", function(e){
    console.log(e.detail)
  })
})


