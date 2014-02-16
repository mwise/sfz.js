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
    this.subject = pegjs.buildParser(data)
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
// ------------------------------")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  context("a string with a single group", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group>")
    })

    it("has no regions", function(){
      expect(this.result.regions).eql([])
    })
  })

  context("a string with a single region", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<region>")
    })

    it("has one region", function(){
      expect(this.result.regions).eql([{}])
    })
  })

  context("a string with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<region> sample=trumpet-pp-c4.wav")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
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
        { sample: "trumpet_pp_c4.wav" },
        { sample: "trumpet_pp_c#4.wav" }
      ])
    })
  })

  context("a string with a single group with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group> <region> sample=trumpet_pp_c4.wav")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        sample: "trumpet_pp_c4.wav"
      }])
    })
  })

  context("a string with a single group with a single region with a sample opcode", function(){
    beforeEach(function(){
      this.result = this.subject.parse("<group> sample=trumpet_pp_c4.wav <region> ")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        sample: "trumpet_pp_c4.wav"
      }])
    })
  })

  context("a string with a two groups and two regions", function(){
    beforeEach(function(){
      this.result = this.subject.parse(" \
        <group> sample=trumpet_pp_c4.wav <region>  \
        <group> <region> sample=trumpet_pp_c#4.wav ")
    })

    it("has two regions with the correct sample opcodes", function(){
      expect(this.result.regions).eql([
        { sample: "trumpet_pp_c4.wav" },
        { sample: "trumpet_pp_c#4.wav" }
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
        { sample: "trumpet_pp_c4.wav", lokey: 59, hikey: 61 },
        { sample: "trumpet_pp_d#4.wav", lokey: 62, hikey: 64 }
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

  })
})
