var midiSelect = new MIDISelect()
var ac = new AudioContext()

var keyCodes = [65, 83, 68, 70, 71, 72, 74, 75]

var sfzUrl = "/70s-synth/70s Organ Vibrato.sfz"

var loadPreset = function(url){
  sfz.load(ac, url, function(instrument){
    window.instrument = instrument
    console.log("instrument loaded")
    //var regions = window.regions = instrument.regions
    //var noteOn = { pitch: 60, velocity: 100, channel: 0 }

    //var regionsToPlay = window.regs = instrument.regionsToPlay(noteOn, 1)
    //console.log
    //_(regs).each(function(region){
      //console.log(region.regionId, region.region_label, region.lokey, region.hikey, region.lovel, region.hivel)
    //})

  })
}

loadPreset(sfzUrl)

$(document).on("ready", function(){
  var $select = $("select");

  _(window.presets).each(function(presetUrls, group){
    $optgroup = $("<optgroup label='" + group + "'></optgroup>")
    _(presetUrls).each(function(url){
      var option = "<option value='" + url + "'>"
      var parts = url.split("/")
      option += parts[parts.length - 1]
      option += "</option>"
      $optgroup.append(option)
    })
    $select.append($optgroup)
  })

  $select.on("change", function(e){
    console.log(e.currentTarget.value)
    loadPreset(e.currentTarget.value)
  })

    midiSelect.on("noteOn", function(e){
      if (!window.instrument) return;
      window.instrument.noteOn(e.detail.channel, e.detail.pitch, e.detail.velocity)
    })

    midiSelect.on("noteOff", function(e){
      if (!window.instrument) return;
      window.instrument.noteOn(e.detail.channel, e.detail.pitch, 0)
    })

    midiSelect.on("controlChange", function(e){
      if (!window.instrument) return;
      console.log(e.detail)
    })

    midiSelect.on("pitchBend", function(e){
      if (!window.instrument) return;
      window.instrument.pitchBend(e.detail.channel, e.detail.bend)
    })

    document.addEventListener("keydown", function(e){
      if (!window.instrument) return;
      var pitch = keyCodes.indexOf(e.keyCode)
      if (pitch != -1) {
        window.instrument.noteOn(1, 60 + pitch, 100)
      }
    })

    document.addEventListener("keyup", function(e){
      if (!window.instrument) return;
      var pitch = keyCodes.indexOf(e.keyCode)
      if (pitch != -1) {
        window.instrument.noteOn(1, 60 + pitch, 0)
      }
    })
})
