var midiSelect = new MIDISelect()
var ac = new webkitAudioContext()

sfz.load(ac, "/example/piano.small.mp3.sfz", function(instrument){
  midiSelect.on("noteOn", function(e){
    instrument.noteOn(e.detail.channel, e.detail.pitch, e.detail.velocity)
  })

  midiSelect.on("controlChange", function(e){
    console.log(e.detail)
  })

  midiSelect.on("pitchBend", function(e){
    console.log(e.detail)
  })
})


