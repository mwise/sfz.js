var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , pegjs = require("pegjs")
  , fs = require("fs")
  , path = require("path")
  , grammarPath = path.join(__dirname + "/../lib/sfz.pegjs");

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
      this.result = this.subject.parse("<region> sample=trumpet_pp_c4.wav")
    })

    it("has one region with the correct sample", function(){
      expect(this.result.regions).eql([{
        sample: "trumpet_pp_c4.wav"
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
      testOpcode(name, "c#4", name, "c#4")
    }

    var testTextOpcode = function(name, options){
      for (var i = 0; i < options.length; i++) {
        testOpcode(name, options[i], name, options[i])
      }
    }

    testIntegerOpcode("lochan")
    testIntegerOpcode("hichan")
    testMidiNoteOpcode("lokey")
    testMidiNoteOpcode("hikey")
    testOpcode("key", "c#4", "lokey", "c#4")
    testOpcode("key", "c#4", "hikey", "c#4")
    testOpcode("key", "1", "lokey", 1)
    testOpcode("key", "1", "hikey", 1)

    testIntegerOpcode("lovel")
    testIntegerOpcode("hivel")
    testIntegerOpcode("lobend")
    testIntegerOpcode("hibend")
    testIntegerOpcode("lochanaft")
    testIntegerOpcode("hichanaft")
    testIntegerOpcode("lopolyaft")
    testIntegerOpcode("hipolyaft")
    testFloatOpcode("lorand")
    testFloatOpcode("hirand")
    testFloatOpcode("lobpm")
    testFloatOpcode("hibpm")
    testIntegerOpcode("seq_length")
    testIntegerOpcode("seq_position")
    testMidiNoteOpcode("sw_lokey")
    testMidiNoteOpcode("sw_hikey")
    testMidiNoteOpcode("sw_last")
    testMidiNoteOpcode("sw_down")
    testMidiNoteOpcode("sw_up")
    testMidiNoteOpcode("sw_previous")
    testTextOpcode("sw_vel", ["current", "previous"])
    testTextOpcode("sw_trigger", ["attack", "release", "first", "legato"])
    testIntegerOpcode("group")
    testIntegerOpcode("off_by")
    testTextOpcode("off_mode", ["fast", "normal"])
    testFloatOpcode("delay")
    testFloatOpcode("delay_random")
    testFloatOpcode("delay_cc1")
    testFloatOpcode("delay_cc2")
    testIntegerOpcode("offset")
    testIntegerOpcode("offset_random")
    testIntegerOpcode("offset_cc1")
    testIntegerOpcode("offset_cc64")
    testIntegerOpcode("end")
    testIntegerOpcode("count")
    testTextOpcode("loop_mode", ["no_loop", "one_shot", "loop_continuous", "loop_sustain"])
    testIntegerOpcode("loop_start")
    testIntegerOpcode("loop_end")
    testFloatOpcode("sync_beats")
    testFloatOpcode("sync_offset")

    testIntegerOpcode("transpose")
    testIntegerOpcode("tune")
    testIntegerOpcode("tune")
    testIntegerOpcode("pitch_keycenter")
    testIntegerOpcode("pitch_keycenter")
    testIntegerOpcode("pitch_keytrack")
    testIntegerOpcode("pitch_keytrack")
    testIntegerOpcode("pitch_veltrack")
    testIntegerOpcode("pitch_veltrack")
    testIntegerOpcode("pitch_random")
    testIntegerOpcode("pitch_random")
    testIntegerOpcode("bend_up")
    testIntegerOpcode("bend_up")
    testIntegerOpcode("bend_down")
    testIntegerOpcode("bend_down")

    testFloatOpcode("pitcheg_delay")

    testFloatOpcode("pitcheg_delay")
    testFloatOpcode("pitcheg_start")
    testFloatOpcode("pitcheg_attack")
    testFloatOpcode("pitcheg_hold")
    testFloatOpcode("pitcheg_decay")
    testFloatOpcode("pitcheg_sustain")
    testFloatOpcode("pitcheg_release")
    testIntegerOpcode("pitcheg_depth")
    testFloatOpcode("pitcheg_vel2delay")
    testFloatOpcode("pitcheg_vel2attack")
    testFloatOpcode("pitcheg_vel2hold")
    testFloatOpcode("pitcheg_vel2decay")
    testFloatOpcode("pitcheg_vel2sustain")
    testIntegerOpcode("pitcheg_vel2depth")

  })
})
