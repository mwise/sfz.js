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
    this.midiIn = this.midiAccess.inputs.values()[this.el.selectedIndex]
    this.midiIn.onmidimessage = this.midiMessageReceived
  }

  MIDISelect.prototype.selectMIDIIn = function(ev){
    var inputs = this.midiAccess.inputs.values();
    var selectedIndex = ev.target.selectedIndex;
    var i = 0;

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      if (i === selectedIndex) {
        this.midiIn = input.value;
        this.midiIn.onmessage = this.midiMessageReceived
      }
      i++;
    }
  }

  MIDISelect.prototype.onMIDIStarted = function(midi){
    if (midi.inputs.size === 0) {
      var selectMIDI = document.getElementById(this.el.id);
      selectMIDI.options.length = 0
      selectMIDI.options[0] = new Option('None', 'none', true, true);
      selectMIDI.disabled = true;
      console.log(selectMIDI.options);
      return;
    }
    this.midiAccess = midi;
    var inputs = this.midiAccess.inputs.values();
    var list = [];
    this.el.options.length = 0

    var selectMIDI = document.getElementById(this.el.id);
    var i = 0;

    selectMIDI.options.length = 0
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      var opt = new Option(input.value.name, input.value.id, i == 0, i == 0)
      list.push(input.value);
      selectMIDI.options[i] = opt
      i++;
    }
    this.midiIn = list[0]
    this.midiIn.onmidimessage = this.midiMessageReceived.bind(this)
    this.el.onchange = this.selectMIDIIn.bind(this)
  }

  MIDISelect.prototype.onMIDISystemError = function(msg){
    console.log("Error encountered: " + msg)
  }

  return MIDISelect
}));
