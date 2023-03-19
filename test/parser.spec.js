var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , _ = require("underscore")
  , pegjs = require("pegjs")
  , fs = require("fs")
  , path = require("path")
  , grammarPath = path.join(__dirname + "/../src/sfz.pegjs");

describe("parsing", function(){
  before(function(done){
    var self = this
    var data = fs.readFileSync(grammarPath, "utf-8")
    this.subject = pegjs.generate(data)
    done()
  })

  context("an empty string", function(){
    beforeEach(function(){
      this.result = this.subject.parse("")
    })

    it("has a type of instrument", function(){
      expect(this.result.type).eql("Instrument")
    })
  })

  context("a string with only comments", function(){
    beforeEach(function(){
      this.result = this.subject.parse("// ------------------------------ \
// Commented text here \
 \
 \
// ------------------------------")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  context("a string with multiline comments", function(){
    beforeEach(function(){
      this.result = this.subject.parse("/* \r\n // ********************************************************************** \r\n */")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  context("a string with a <global> header", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<global>")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  context("a string with a single <master> header", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<master>")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  describe("<control> headers", function(){
    context("a string with a single <control> header", function(){
      beforeEach(function(){
        this.result = this.subject.parse("<control>")
      })

      it("has no regions", function(){
        expect(this.result.regions).eql([])
      })
    })

    context("two <control> headers and two regions", function(){
      beforeEach(function(){
        this.result = this.subject.parse(" \
          <control> sample=trumpet_pp_c4.wav <region> lokey=60  \
          <control> <region> sample=trumpet_pp_c#4.wav ")
      })

      it("has two regions with the correct sample opcodes", function(){
        expect(this.result.regions).eql([
          { regionId: "r0", sample: "trumpet_pp_c4.wav", lokey: 60 },
          { regionId: "r1", sample: "trumpet_pp_c#4.wav" }
        ])
      })
    })

    describe("opcodes", function(){
      describe("octave_offset", function(){
        beforeEach(function(){
          this.octave_offset = 3
          this.result = this.subject.parse(" \
            <control> octave_offset=" + this.octave_offset + " \
            <region> lokey=10 hikey=20 pitch_keycenter=10 sw_lokey=10 sw_hikey=20 \
                      sw_last=10 sw_down=10 sw_up=20 sw_previous=20")

        })

        it("applies the octave offset to all MIDI note opcodes", function(){
          noteOffset = this.octave_offset * 12
          expect(this.result.regions).eql([
            {
              regionId: "r0",
              lokey: 10 + noteOffset,
              hikey: 20 + noteOffset,
              pitch_keycenter: 10 + noteOffset,
              sw_lokey: 10 + noteOffset,
              sw_hikey: 20 + noteOffset,
              sw_last: 10 + noteOffset,
              sw_down: 10 + noteOffset,
              sw_up: 20 + noteOffset,
              sw_previous: 20 + noteOffset
            }
          ])
        })
      })

      describe("note_offset", function(){
        beforeEach(function(){
          this.noteOffset = 3
          this.result = this.subject.parse(" \
            <control> note_offset=" + this.noteOffset + " \
            <region> lokey=10 hikey=20 pitch_keycenter=10 sw_lokey=10 sw_hikey=20 \
                      sw_last=10 sw_down=10 sw_up=20 sw_previous=20")

        })

        it("applies the octave offset to all MIDI note opcodes", function(){
          expect(this.result.regions).eql([
            {
              regionId: "r0",
              lokey: 10 + this.noteOffset,
              hikey: 20 + this.noteOffset,
              pitch_keycenter: 10 + this.noteOffset,
              sw_lokey: 10 + this.noteOffset,
              sw_hikey: 20 + this.noteOffset,
              sw_last: 10 + this.noteOffset,
              sw_down: 10 + this.noteOffset,
              sw_up: 20 + this.noteOffset,
              sw_previous: 20 + this.noteOffset
            }
          ])
        })
      })
    })
  })

  context("a string with a single <group> header", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group>")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  describe("<curve> headers", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<curve> \
                                      v000=0 v001=6.20001e-05 v127=1")
    })

    it("defines a single curve", function(){
      expect(this.result.curves).eql([{
        0: 0,
        1: parseFloat("6.20001e-05"),
        127: 1
      }])
    })
  })

  context("a string with a single region", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<region> lokey=50")
    })

    it("has one region", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        lokey: 50
      }])
    })
  })

  context("a string with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<region> lokey=60 sample=trumpet-pp-c4.wav")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        lokey: 60,
        sample: "trumpet-pp-c4.wav"
      }])
    })
  })

  context("a string two regions with sample opcodes", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<region> sample=trumpet_pp_c4.wav \
                                       <region> sample=trumpet_pp_c#4.wav ")
    })

    it("has two regions with the correct sample", function(){
      expect(this.result.regions).eql([
        { regionId: "r0", sample: "trumpet_pp_c4.wav" },
        { regionId: "r1", sample: "trumpet_pp_c#4.wav" }
      ])
    })
  })

  context("a string with a <global> with a sample opcde and a single region", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<global> sample=trumpet_pp_c4.wav <region> lokey=60")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        lokey: 60,
        sample: "trumpet_pp_c4.wav"
      }])
    })
  })

  context("a string with a single group with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group> <region> sample=trumpet_pp_c4.wav lokey=60")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        lokey: 60,
        sample: "trumpet_pp_c4.wav"
      }])
    })
  })

  context("a string with a single group with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group> sample=trumpet_pp_c4.wav <region> lokey=60")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        lokey: 60,
        sample: "trumpet_pp_c4.wav"
      }])
    })
  })

  context("a string with a two groups and two regions", function(){
    beforeEach(function(){
      this.result = this.subject.parse(" \
        <group> sample=trumpet_pp_c4.wav <region> lokey=60  \
        <group> <region> sample=trumpet_pp_c#4.wav ")
    })

    it("has two regions with the correct sample opcodes", function(){
      expect(this.result.regions).eql([
        { regionId: "r0", sample: "trumpet_pp_c4.wav", lokey: 60 },
        { regionId: "r1", sample: "trumpet_pp_c#4.wav" }
      ])
    })
  })

  context("a string with a one groups and two regions", function(){
    beforeEach(function(){
      this.result = this.subject.parse(" \
        <group> <region> sample=trumpet_pp_c4.wav lokey=b3 hikey=c#4 \
        <region> sample=trumpet_pp_d#4.wav lokey=d4 hikey=e4")
    })

    it("has two regions with the correct sample opcodes", function(){
      expect(this.result.regions).eql([
        { regionId: "r0", sample: "trumpet_pp_c4.wav", lokey: 59, hikey: 61 },
        { regionId: "r1", sample: "trumpet_pp_d#4.wav", lokey: 62, hikey: 64 }
      ])
    })
  })

  context("default path (hardcoded to ../)", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<control> \
 hint_ram_based=1 \
 default_path=../ \
 set_cc1=0     //Power-on Default Values: Modulation \r\n\
 set_cc11=127  //Power-on Default Values: Expression \r\n\
 set_cc64=0    //Power-on Default Values: Sustain Pedal \r\n\
 \
<global> \
 sample=sf2_smpl.wav \
 \
<group> \
 volume=-4 \
<region> \
 loop_mode=loop_continuous \r\n\
 region_label=Grand Piano-D6 \r\n\
 loop_start=7003344 loop_end=7038489 ")
    })

    it("prepends default path to sample opcode values", function(){
      expect(this.result.regions).eql([{
        regionId: "r0",
        hint_ram_based: 1,
        loop_end: 7038489,
        loop_start: 7003344,
        loop_mode: "loop_continuous",
        region_label: "Grand Piano-D6 ",
        sample: "../sf2_smpl.wav",
        volume: -4,
        set_cc1: 0,
        set_cc11: 127,
        set_cc64: 0
      }])
    })
  })

  context("a string with a one groups and two regions", function(){
    beforeEach(function(){
      this.result = this.subject.parse(" \
        <group> <region> sample=trumpet_pp_c4.wav lokey=b3 hikey=c#4 \
        <region> sample=trumpet_pp_d#4.wav lokey=d4 hikey=e4")
    })

    it("has two regions with the correct sample opcodes", function(){
      expect(this.result.regions).eql([
        { regionId: "r0", sample: "trumpet_pp_c4.wav", lokey: 59, hikey: 61 },
        { regionId: "r1", sample: "trumpet_pp_d#4.wav", lokey: 62, hikey: 64 }
      ])
    })
  })

  context("a real-life example", function(){
    beforeEach(function(){
      this.result = this.subject.parse("/* \
// ********************************************************************** \
// Some stuff here \
// ********************************************************************** \
// Comments       : ***     License v2.0    *** \
 \
** Some more stuff here ** \
*/ \
 \
<control> \
 hint_ram_based=1 \
 default_path=../ \
 set_cc1=0     //Power-on Default Values: Modulation \r\n\
 set_cc11=127  //Power-on Default Values: Expression \r\n\
 set_cc64=0    //Power-on Default Values: Sustain Pedal \
 \
<global> \
 sample=sf2_smpl.wav \
 \
<master> \
 lokey=0 hikey=35 \
 lovel=0 hivel=49 \
 global_volume=8 \
 ampeg_attack=1 \
 fil_type=lpf_2p \
 cutoff=12.6748 \
 resonance=0.5 \
 \
<group> \
 volume=-4 \
 //SFZModUnknown!!! \
//EG WITHOUT TARGET \
 \
 fil_type=lpf_2p \
 cutoff=1333.09 \
 resonance=0.5 \
 \
<region> \
 lokey=0 hikey=27 \
 pan=-68 \
 volume=-7 \
 ampeg_sustain=0.001 \
 ampeg_attack=0.00799973 \
 ampeg_decay=19.1486 \
 ampeg_release=3.00008 \
 loop_mode=loop_continuous \
 region_label=Grand Piano-D1 \
 //Sample Rate override main:48000 curr:31000 \
 pitch_keycenter=26 tune=-756 offset=6967704 end=7038491 \
 loop_start=7003344 loop_end=7038489 ")
    })

    it("works", function(){
      expect(this.result.regions).eql([
      ])
    })
  })

  context("master headers", function(){
    beforeEach(function(){
      this.result = this.subject.parse(" \
<master> \
 lokey=0 hikey=35 \
 lovel=0 hivel=49 \
 global_volume=8 \
 cutoff=12.6748 \
 resonance=0.5 \
 \
<group> \
 volume=-4 \
 cutoff=2333.09 \
 resonance=0.5 \
 \
<region> \
 lokey=0 hikey=27 \
 pan=-68 \
\
<master> \
 lokey=0 hikey=35 \
 lovel=50 hivel=65 \
 global_volume=6 \
 cutoff=3.68006 \
 resonance=0.5 \
 \
<group> \
 volume=-4 \
 \
 cutoff=1333.09 \
 resonance=0.5 \
 \
<region> \
 lokey=0 hikey=27 \
 pan=-68 \
 volume=-7 \
")
    })

    it("passes values from last master to regions", function(){
      expect(this.result.regions).eql([
        {
          global_volume: 8,
          lokey: 0,
          hikey: 27,
          lovel: 0,
          hivel: 49,
          volume: -4,
          cutoff: 2333.09,
          resonance: 0.5,
          pan: -68,
          regionId: "r0"
        },
        {
          global_volume: 6,
          lokey: 0,
          hikey: 27,
          lovel: 50,
          hivel: 65,
          volume: -7,
          cutoff: 1333.09,
          resonance: 0.5,
          pan: -68,
          regionId: "r1"
        }
      ])
    })
  })

  describe("opcodes", function(){

    beforeEach(function(){
      this.sfzData = "<region> "
    })

    var testOpcode = function(name, strValue, paramName, paramValue) {
      describe(name, function(){
        beforeEach(function(){
          this.sfzData += (name + "=" + strValue)
          this.result = this.subject.parse(this.sfzData)
        })

        it("sets '" + paramName + "'", function(){
          expect(this.result.regions[0][paramName]).eql(paramValue)
        })
      })
    }

    var testFloatOpcode = function(name){
      testOpcode(name, "1.2", name, 1.2)
      testOpcode(name, "-1.2", name, -1.2)
    }

    var testIntegerOpcode = function(name){
      testOpcode(name, "2", name, 2)
      testOpcode(name, "-2", name, -2)
    }

    var testMidiNoteOpcode = function(name){
      testOpcode(name, "2", name, 2)
      testOpcode(name, "c-1", name, 0)
      testOpcode(name, "c3", name, 48)
      testOpcode(name, "c#3", name, 49)
      testOpcode(name, "b3", name, 59)
      testOpcode(name, "c4", name, 60)
      testOpcode(name, "c#4", name, 61)
      testOpcode(name, "d4", name, 62)
    }

    var testTextOpcode = function(name, options){
      for (var i = 0; i < options.length; i++) {
        testOpcode(name, options[i], name, options[i])
      }
    }

    testOpcode("key", "c#4", "lokey", 61)
    testOpcode("key", "c#4", "hikey", 61)
    testOpcode("key", "c#4", "pitch_keycenter", 61)
    testOpcode("key", "1", "lokey", 1)
    testOpcode("key", "1", "hikey", 1)

    var midiNoteOpcodes = [
      "lokey",
      "hikey",
      "sw_lokey",
      "sw_hikey",
      "sw_last",
      "sw_down",
      "sw_up",
      "sw_previous",
      "pitch_keycenter"
    ]
    _(midiNoteOpcodes).each(function(opcode){
      testMidiNoteOpcode(opcode)
    })

    testTextOpcode("sw_vel", ["current", "previous"])
    testTextOpcode("sw_trigger", ["attack", "release", "first", "legato"])
    testTextOpcode("off_mode", ["fast", "normal"])
    testTextOpcode("loop_mode", ["no_loop", "one_shot", "loop_continuous", "loop_sustain"])
    testTextOpcode("fil_type",
      ["lpf_1p", "hpf_1p", "lpf_2p", "hpf_2p", "bpf_2p", "brf_2p"])
    testTextOpcode("xf_keycurve", ["gain", "power"])
    testTextOpcode("xf_velcurve", ["gain", "power"])
    testTextOpcode("xf_cccurve", ["gain", "power"])

    var floatOpcodes = [
      "fillfo_delay",
      "fillfo_fade",
      "fillfo_freq",
      "lorand",
      "hirand",
      "lotimer",
      "hitimer",
      "lobpm",
      "hibpm",
      "delay",
      "delay_random",
      "delay_cc1",
      "delay_cc2",
      "sync_beats",
      "sync_offset",
      "pitcheg_delay",
      "pitcheg_start",
      "pitcheg_attack",
      "pitcheg_hold",
      "pitcheg_decay",
      "pitcheg_sustain",
      "pitcheg_release",
      "pitcheg_vel2delay",
      "pitcheg_vel2attack",
      "pitcheg_vel2hold",
      "pitcheg_vel2decay",
      "pitcheg_vel2sustain",
      "pitchlfo_delay",
      "pitchlfo_fade",
      "pitchlfo_freq",
      "pitchlfo_freqcc1",
      "pitchlfo_freqcc60",
      "pitchlfo_freqchanaft",
      "pitchlfo_freqpolyaft",
      "cutoff",
      "resonance",
      "fileg_delay",
      "fileg_start",
      "fileg_attack",
      "fileg_hold",
      "fileg_decay",
      "fileg_sustain",
      "fileg_release",
      "fileg_vel2delay",
      "fileg_vel2attack",
      "fileg_vel2hold",
      "fileg_vel2decay",
      "fileg_vel2sustain",
      "fileg_vel2release",
      "volume",
      "pan",
      "width",
      "position",
      "amp_keytrack",
      "amp_veltrack",
      "amp_random",
      "rt_decay",
      "ampeg_delay",
      "ampeg_start",
      "ampeg_attack",
      "ampeg_hold",
      "ampeg_decay",
      "ampeg_sustain",
      "ampeg_release",
      "ampeg_vel2delay",
      "ampeg_vel2attack",
      "ampeg_vel2hold",
      "ampeg_vel2decay",
      "ampeg_vel2sustain",
      "ampeg_vel2release",
      "amplfo_delay",
      "amplfo_fade",
      "amplfo_freq",
      "amplfo_depthchanaft",
      "amplfo_depthpolyaft",
      "amplfo_depth",
      "amplfo_freqchanaft",
      "amplfo_freqpolyaft",
      "eq1_freq",
      "eq2_freq",
      "eq3_freq",
      "eq1_vel2freq",
      "eq2_vel2freq",
      "eq3_vel2freq",
      "eq1_bw",
      "eq2_bw",
      "eq3_bw",
      "eq1_gain",
      "eq2_gain",
      "eq3_gain",
      "eq1_vel2gain",
      "eq2_vel2gain",
      "eq3_vel2gain",
      "effect1",
      "effect2"
    ]
    _(floatOpcodes).each(function(opcode){
      testFloatOpcode(opcode)
    })

    var integerOpcodes = [
      "fillfo_depth",
      "fillfo_freqchanaft",
      "fillfo_freqpolyaft",
      "fillfo_freqchanaft",
      "fillfo_freqpolyaft",
      "lochan",
      "hichan",
      "lovel",
      "hivel",
      "lobend",
      "hibend",
      "lochanaft",
      "hichanaft",
      "lopolyaft",
      "hipolyaft",
      "loprog",
      "hiprog",
      "seq_length",
      "seq_position",
      "group",
      "off_by",
      "offset",
      "offset_random",
      "offset_cc1",
      "offset_cc64",
      "end",
      "count",
      "loop_start",
      "loop_end",
      "transpose",
      "tune",
      "tune",
      "pitch_keytrack",
      "pitch_veltrack",
      "pitch_random",
      "bend_up",
      "bend_down",
      "pitcheg_depth",
      "fileg_depth",
      "fileg_vel2depth",
      "fil_keytrack",
      "fil_keycenter",
      "fil_veltrack",
      "fil_random",
      "cutoff_cc1",
      "cutoff_cc2",
      "cutoff_chanaft",
      "cutoff_polyaft",
      "pitchlfo_depthcc1",
      "pitchlfo_depthcc60",
      "pitchlfo_depth",
      "pitchlfo_depthchanaft",
      "pitchlfo_depthpolyaft",
      "pitcheg_vel2depth",
      "amp_keycenter",
      "output",
      "xfin_lokey",
      "xfin_hikey",
      "xfin_lovel",
      "xfin_hivel",
      "xfout_lovel",
      "xfout_hivel"
    ]
    _(integerOpcodes).each(function(opcode){
      testIntegerOpcode(opcode)
    })

    var sequentialFloatOpcodes = [
      "fillfo_freqcc",
      "gain_cc",
      "ampeg_delaycc",
      "ampeg_startcc",
      "ampeg_attackcc",
      "ampeg_holdcc",
      "ampeg_decaycc",
      "ampeg_sustaincc",
      "ampeg_releasecc",
      "amplfo_depthcc",
      "amplfo_freqcc",
      "eq1_freqcc",
      "eq2_freqcc",
      "eq3_freqcc",
      "eq1_bwcc",
      "eq2_bwcc",
      "eq3_bwcc",
      "eq1_gaincc",
      "eq2_gaincc",
      "eq3_gaincc",
      "amp_velcurve_",
      "amp_velcurve_"
    ]
    _(sequentialFloatOpcodes).each(function(opcode){
      testFloatOpcode(opcode + 1)
      testFloatOpcode(opcode + 127)
    })

    var sequentialIntegerOpcodes = [
      "fillfo_depthcc",
      "fillfo_depthcc",
      "xfin_locc",
      "xfin_hicc",
      "xfout_locc",
      "xfout_hicc"
    ]
    _(sequentialIntegerOpcodes).each(function(opcode){
      testIntegerOpcode(opcode + 1)
    })


    describe("custom ARIA opcodes", function(){

      testTextOpcode("default_path", ["../"])

      var ariaIntegerOpcodes = [
        "global_volume",
        "hint_ram_based",
        "lfo06_wave",
        "lfo06_pitch",
        "lfo06_pitch_oncc129"
      ]

      var ariaFloatOpcodes = [
        "lfo06_freq",
        "global_volume"
      ]

      var ariaSequentialIntegerOpcodes = [
        "set_cc",
        "lfo06_pitch_oncc",
        "amplitude_oncc",
        "amplitude_curvecc"
      ]

      _(ariaIntegerOpcodes).each(function(opcode){
        testIntegerOpcode(opcode)
      })

      _(ariaFloatOpcodes).each(function(opcode){
        testFloatOpcode(opcode)
      })

      _(ariaSequentialIntegerOpcodes).each(function(opcode){
        testIntegerOpcode(opcode + 1)
        testIntegerOpcode(opcode + 127)
      })

      _(128).times(function(i){
        var opcode = "" + i
        if (opcode.length == 1){
          opcode = "00" + opcode
        } else if (opcode.length == 2) {
          opcode = "0" + opcode
        } else if (opcode.length == 0) {
          opcode = "000"
        }

        testFloatOpcode("v" + opcode)
      })

    })

    describe("flex envelope generators", function(){

      context("when flex eg directives are prsent", function(){
        beforeEach(function(){
          this.result = this.subject.parse(" \
eg06_pitch=4000 \
eg06_cutoff=-3600 \
eg06_sustain=4 \
eg06_time0=0.001 \
eg06_level0=0 \
eg06_shape0=0 \
eg06_time1=0.001 \
eg06_level1=1 \
eg06_shape1=0 \
eg06_time2=0.001 \
eg06_level2=1 \
eg06_shape2=0 \
eg06_time3=0.001 \
eg06_level3=1 \
eg06_shape3=0 \
eg06_time4=0.001 \
eg06_level4=1 \
eg06_shape4=0 \
eg06_time5=0.001 \
eg06_level5=0 \
eg06_shape5=0 ")
        })

        it("doesn't blow up", function(){
          expect(this.result.regions).eql([])
        })
      })
    })

    describe("lfo directives", function(){

      context("when lfo directives are present", function(){
        beforeEach(function(){
          this.result = this.subject.parse(" \
lfo07_wave=0 \
lfo07_freq=5.12681 \
lfo07_delay=0.00681 \
lfo06_wave=0 \
lfo06_pitch=0 \
lfo06_amplitude=99.55 \
lfo06_cutoff=-26 \
lfo06_phase=0 \
lfo06_freq=5.12681 ")
        })

        it("doesn't blow up", function(){
          expect(this.result.regions).eql([])
        })
      })
    })
  })
})
