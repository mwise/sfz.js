(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.MIDISelect = factory();
    }
}(this, function () {

  var noop = function(){}

  if (!window.CustomEvent) {
    (function () {
      function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
      };

      CustomEvent.prototype = window.CustomEvent.prototype;

      window.CustomEvent = CustomEvent;
    })();
  }

  var MIDISelect = function(opts){
    opts = opts  || {}

    if (opts.elementId) {
      this.el = document.getElementById(opts.elementId)
      if (!this.el) {
        console.log("Error! Element does not exist")
        return
      }
    } else {
      this.el = document.createElement("select")
      this.el.setAttribute("id", "midi-select")
    }

    this.midiAccess = null
    this.midiIn = null

    if (typeof navigator.requestMIDIAccess == "function") {
      console.log("requesting midi")
      navigator.requestMIDIAccess().then(this.onMIDIStarted.bind(this), this.onMIDISystemError.bind(this))
    } else {
      console.log("Error - this browser does not support MIDI.")
    }

  }
  MIDISelect.prototype.on = function(eventName, callback){
    this.el.addEventListener(eventName, callback)
  }

  MIDISelect.prototype.midiMessageReceived = function(ev){
    var cmd = ev.data[0] >> 4
    var channel = ev.data[0] & 0xf
    var data1 = ev.data[1]
    var data2 = ev.data[2]

    var event = null

    if (cmd == 8) {
      event = new CustomEvent("noteOff", {
        detail: {
          channel: channel,
          pitch: data1,
          velocity: data2
        }
      })
    } else if (cmd == 9) {
      event = new CustomEvent("noteOn", {
        detail: {
          channel: channel,
          pitch: data1,
          velocity: data2
        }
      })
    } else if (cmd == 11) {
      event = new CustomEvent("controlChange", {
        detail: {
          channel: channel,
          controller: data1,
          value: data2
        }
      })
    } else if (cmd == 14) {
      event = new CustomEvent("pitchBend", {
        detail: {
          channel: channel,
          bend: (data2 * 128.0 + data1) - 8192.0
        }
      })
    }
    if (event) this.el.dispatchEvent(event);
  }

  MIDISelect.prototype.changeMIDIPort = function(){
    this.midiIn = this.midiAccess.inputs()[this.el.selectedIndex]
    this.midiIn.onmidimessage = this.midiMessageReceived
  }

  MIDISelect.prototype.selectMIDIIn = function(ev){
    var list = this.midiAccess.inputs()
    var selectedIndex = ev.target.selectedIndex

    if (list.length >= selectedIndex) {
      this.midiIn = list[selectedIndex]
      this.midiIn.onmessage = this.midiMessageReceived
    }
  }

  MIDISelect.prototype.onMIDIStarted = function(midi){
    this.midiAccess = midi
    var list = this.midiAccess.inputs()
    this.el.options.length = 0

    var selectMIDI = document.getElementById(this.el.id)

    selectMIDI.options.length = 0
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        var opt = new Option(list[i].name, list[i].fingerprint, i == 0, i == 0)
        selectMIDI.options[i] = opt
      }
      this.midiIn = list[0]
      this.midiIn.onmidimessage = this.midiMessageReceived.bind(this)
      this.el.onchange = this.selectMIDIIn.bind(this)
    }
  }

  MIDISelect.prototype.onMIDISystemError = function(msg){
    console.log("Error encountered: " + msg)
  }

  return MIDISelect
}));
