var midiSelect = new MIDISelect()
var ac = new webkitAudioContext()

var sfzUrl = "/example/piano.mp3.sfz"
var sfzUrl = "/example/Woodwinds - Oboe Solo.sfz"
var sfzUrl = "/example/trumpet.sfz"
var sfzUrl = "/example/horn-solo.mp3.sfz"
sfz.load(ac, sfzUrl, function(instrument){
  window.instrument = instrument

  midiSelect.on("noteOn", function(e){
    instrument.noteOn(e.detail.channel, e.detail.pitch, e.detail.velocity)
  })

  midiSelect.on("controlChange", function(e){
    console.log(e.detail)
  })

  midiSelect.on("pitchBend", function(e){
    instrument.pitchBend(e.detail.channel, e.detail.bend)
  })
})
