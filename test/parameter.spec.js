var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , subject = require("../src/parameter")
  , _ = require("underscore")

var MAX_INT = 4294967296
  , MAX_BEND = 9600

describe(subject.name, function(){
  describe("input controls", function(){
    it("defines input controls", function(){
      var inputControls = [
        "lochan",
        "hichan",
        "lokey",
        "hikey",
        "lovel",
        "hivel",
        "lobend",
        "hibend",
        "lochanaft",
        "hichanaft",
        "lopolyaft",
        "hipolyaft",
        "lorand",
        "hirand",
        "lobpm",
        "hibpm",
        "seq_length",
        "seq_position",
        "sw_lokey",
        "sw_hikey",
        "sw_last",
        "sw_down",
        "sw_up",
        "sw_previous",
        "sw_vel",
        "trigger",
        "group",
        "off_by",
        "off_mode"
      ]
      _(128).times(function(i){
        inputControls.push("on_locc" + i)
        inputControls.push("on_hicc" + i)
      })
      expect(subject.inputControls).eql(inputControls)
    })

    it("defines performance parameters", function(){
      var performanceParameters = [
        "delay",
        "delay_random",
        "offset",
        "offset_random",
        "end",
        "count",
        "loop_mode",
        "loop_start",
        "loop_end",
        "sync_beats",
        "sync_offset",
        "transpose",
        "tune",
        "pitch_keycenter",
        "pitch_keytrack",
        "pitch_veltrack",
        "pitch_random",
        "bend_up",
        "bend_down",
        "bend_step",
        "pitcheg_delay",
        "pitcheg_start",
        "pitcheg_attack",
        "pitcheg_hold",
        "pitcheg_decay",
        "pitcheg_sustain",
        "pitcheg_release",
        "pitcheg_depth",
        "pitcheg_vel2delay",
        "pitcheg_vel2attack",
        "pitcheg_vel2hold",
        "pitcheg_vel2decay",
        "pitcheg_vel2sustain",
        "pitcheg_vel2release",
        "pitcheg_vel2depth",
        "pitchlfo_delay",
        "pitchlfo_fade",
        "pitchlfo_freq",
        "pitchlfo_depth",
        "pitchlfo_depthchanaft",
        "pitchlfo_depthpolyaft",
        "pitchlfo_freqchanaft",
        "pitchlfo_freqpolyaft",
        "fil_type",
        "cutoff",
        "cutoff_chanaft",
        "cutoff_polyaft",
        "resonance",
        "fil_keycenter",
        "fil_veltrack",
        "fil_random",
        "fileg_delay",
        "fileg_start",
        "fileg_attack",
        "fileg_hold",
        "fileg_decay",
        "fileg_sustain",
        "fileg_release",
        "fileg_depth",
        "fileg_vel2delay",
        "fileg_vel2attack",
        "fileg_vel2hold",
        "fileg_vel2decay",
        "fileg_vel2sustain",
        "fileg_vel2release",
        "fileg_vel2depth",
        "fillfo_delay",
        "fillfo_fade",
        "fillfo_freq",
        "fillfo_depth",
        "fillfo_depthchanaft",
        "fillfo_depthpolyaft",
        "fillfo_freqcc",
        "fillfo_freqchanaft",
        "fillfo_freqpolyaft",
        "volume",
        "pan",
        "width",
        "position",
        "amp_keytrack",
        "amp_keycenter",
        "amp_veltrack",
        "amp_random",
        "rt_decay",
        "output",
        "xfin_lokey",
        "xfin_hikey",
        "xfout_lokey",
        "xfout_hikey",
        "xf_keycurve",
        "xfin_lovel",
        "xfout_hivel",
        "xf_velcurve",
        "xf_cccurve",
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
        "amplfo_depth",
        "amplfo_depthchanaft",
        "amplfo_depthpolyaft",
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

      var seqPerformanceParameters = [
        "delay_cc",
        "offset_cc",
        "pitchlfo_depthcc",
        "pitchlfo_freqcc",
        "cutoff_cc",
        "fillfo_depthcc",
        "amp_velcurve_",
        "gain_cc",
        "xfin_locc",
        "xfin_hicc",
        "xfout_locc",
        "xfout_hicc",
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
        "eq3_gaincc"
      ]
      _(128).times(function(i){
        _(seqPerformanceParameters).each(function(paramName){
          performanceParameters.push(paramName + i)
        })
      })

      expect(subject.performanceParameters).eql(performanceParameters)
    })
  })

  describe("defaults", function(){
    var testNumericParam = function(name, value, min, max){
      describe(name, function(){
        beforeEach(function(){
          this.subject = subject.defaults[name]
        })

        it("value: " + value, function(){
          expect(this.subject.value).eql(value)
        })

        it("min: " + min, function(){
          expect(this.subject.min).eql(min)
        })

        it("max: " + max, function(){
          expect(this.subject.max).eql(max)
        })
      })
    }

    var testTextParam = function(name, value, allowed){
      describe(name, function(){
        beforeEach(function(){
          this.subject = subject.defaults[name]
        })

        it("value: " + value, function(){
          expect(this.subject.value).eql(value)
        })

        it("allow values: ", function(){
          expect(this.subject.allowedValues).eql(allowed)
        })
      })
    }

    testNumericParam("lochan", 0, 0, 15)
    testNumericParam("hichan", 15, 0, 15)
    testNumericParam("lokey", 0, 0, 127)
    testNumericParam("hikey", 127, 0, 127)
    testNumericParam("lovel", 0, 0, 127)
    testNumericParam("hivel", 127, 0, 127)
    testNumericParam("lobend", -8192, -8192, 8192)
    testNumericParam("hibend", 8192, -8192, 8192)
    testNumericParam("lochanaft", 0, 0, 127)
    testNumericParam("hichanaft", 127, 0, 127)
    testNumericParam("lopolyaft", 0, 0, 127)
    testNumericParam("hipolyaft", 127, 0, 127)
    testNumericParam("lorand", 0, 0, 1)
    testNumericParam("hirand", 1, 0, 1)
    testNumericParam("lobpm", 0, 0, 500)
    testNumericParam("hibpm", 500, 0, 500)
    testNumericParam("seq_length", 1, 1, 100)
    testNumericParam("seq_position", 1, 1, 100)
    testNumericParam("sw_lokey", 0, 0, 127)
    testNumericParam("sw_hikey", 127, 0, 127)
    testNumericParam("sw_last", 0, 0, 127)
    testNumericParam("sw_down", 0, 0, 127)
    testNumericParam("sw_up", 0, 0, 127)
    testNumericParam("sw_previous", 0, 0, 127)
    testTextParam("sw_vel", "current", ["current", "previous"])
    testTextParam("trigger", "attack",
                  ["attack", "release", "first", "legato"])
    testNumericParam("group", 0, 0, MAX_INT)
    testNumericParam("off_by", 0, 0, MAX_INT)
    testTextParam("off_mode", "fast", ["fast", "normal"])

    testNumericParam("delay", 0, 0, 100)
    testNumericParam("delay_random", 0, 0, 100)
    testNumericParam("offset", 0, 0, MAX_INT)
    testNumericParam("offset_random", 0, 0, MAX_INT)
    testNumericParam("end", 0, 0, MAX_INT)
    testNumericParam("count", 0, 0, MAX_INT)
    testTextParam("loop_mode", null,
                  ["no_loop", "one_shot", "loop_continuous", "loop_sustain"])
    testNumericParam("loop_start", 0, 0, MAX_INT)
    testNumericParam("loop_end", 0, 0, MAX_INT)
    testNumericParam("sync_beats", 0, 0, 32)
    testNumericParam("sync_offset", 0, 0, 32)

    testNumericParam("transpose", 0, -127, 127)
    testNumericParam("tune", 0, -100, 100)
    testNumericParam("pitch_keycenter", 60, -127, 127)
    testNumericParam("pitch_keytrack", 0, -1200, 1200)
    testNumericParam("pitch_veltrack", 0, -MAX_BEND, MAX_BEND)
    testNumericParam("pitch_random", 0, 0, MAX_BEND)
    testNumericParam("bend_up", 200, -MAX_BEND, MAX_BEND)
    testNumericParam("bend_down", -200, -MAX_BEND, MAX_BEND)
    testNumericParam("bend_step", 1, 1, 1200)

    testNumericParam("pitcheg_delay", 0, 0, 100)
    testNumericParam("pitcheg_start", 0, 0, 100)
    testNumericParam("pitcheg_attack", 0, 0, 100)
    testNumericParam("pitcheg_hold", 0, 0, 100)
    testNumericParam("pitcheg_decay", 0, 0, 100)
    testNumericParam("pitcheg_sustain", 0, 0, 100)
    testNumericParam("pitcheg_release", 0, 0, 100)
    testNumericParam("pitcheg_depth", 0, -12000, 12000)
    testNumericParam("pitcheg_vel2delay", 0, -100, 100)
    testNumericParam("pitcheg_vel2attack", 0, -100, 100)
    testNumericParam("pitcheg_vel2hold", 0, -100, 100)
    testNumericParam("pitcheg_vel2decay", 0, -100, 100)
    testNumericParam("pitcheg_vel2sustain", 0, -100, 100)
    testNumericParam("pitcheg_vel2release", 0, -100, 100)
    testNumericParam("pitcheg_vel2depth", 0, -12000, 12000)

    testNumericParam("pitchlfo_delay", 0, 0, 100)
    testNumericParam("pitchlfo_fade", 0, 0, 100)
    testNumericParam("pitchlfo_freq", 0, 0, 20)
    testNumericParam("pitchlfo_depth", 0, -1200, 1200)
    testNumericParam("pitchlfo_depthchanaft", 0, -1200, 1200)
    testNumericParam("pitchlfo_depthpolyaft", 0, -1200, 1200)
    testNumericParam("pitchlfo_freqchanaft", 0, -200, 200)
    testNumericParam("pitchlfo_freqpolyaft", 0, -200, 200)

    testTextParam("fil_type", "lpf_2p",
      ["lpf_1p", "hpf_1p", "lpf_2p", "hpf_2p", "bpf_2p", "brf_2p"])
    testNumericParam("cutoff", null, 0, 22050)
    testNumericParam("cutoff_chanaft", 0, -MAX_BEND, MAX_BEND)
    testNumericParam("cutoff_polyaft", 0, -MAX_BEND, MAX_BEND)
    testNumericParam("resonance", 0, 0, 40)
    testNumericParam("fil_keytrack", 0, 0, 1200)
    testNumericParam("fil_keycenter", 60, 0, 127)
    testNumericParam("fil_veltrack", 0, -MAX_BEND, MAX_BEND)
    testNumericParam("fil_random", 0, 0, MAX_BEND)

    testNumericParam("fileg_delay", 0, 0, 100)
    testNumericParam("fileg_start", 0, 0, 100)
    testNumericParam("fileg_attack", 0, 0, 100)
    testNumericParam("fileg_hold", 0, 0, 100)
    testNumericParam("fileg_decay", 0, 0, 100)
    testNumericParam("fileg_sustain", 0, 0, 100)
    testNumericParam("fileg_release", 0, 0, 100)
    testNumericParam("fileg_depth", 0, -12000, 12000)
    testNumericParam("fileg_vel2delay", 0, -100, 100)
    testNumericParam("fileg_vel2attack", 0, -100, 100)
    testNumericParam("fileg_vel2hold", 0, -100, 100)
    testNumericParam("fileg_vel2decay", 0, -100, 100)
    testNumericParam("fileg_vel2sustain", 0, -100, 100)
    testNumericParam("fileg_vel2release", 0, -100, 100)
    testNumericParam("fileg_vel2depth", 0, -12000, 12000)

    testNumericParam("fillfo_delay", 0, 0, 100)
    testNumericParam("fillfo_fade", 0, 0, 100)
    testNumericParam("fillfo_freq", 0, 0, 20)
    testNumericParam("fillfo_depth", 0, -1200, 1200)
    testNumericParam("fillfo_depthchanaft", 0, -1200, 1200)
    testNumericParam("fillfo_depthpolyaft", 0, -1200, 1200)
    testNumericParam("fillfo_freqchanaft", 0, -200, 200)
    testNumericParam("fillfo_freqpolyaft", 0, -200, 200)

    testNumericParam("volume", 0, -144, 6)
    testNumericParam("pan", 0, -100, 100)
    testNumericParam("width", 0, -100, 100)
    testNumericParam("position", 0, -100, 100)
    testNumericParam("amp_keytrack", 0, -96, 12)
    testNumericParam("amp_keycenter", 60, 0, 127)
    testNumericParam("amp_veltrack", 100, -100, 100)
    testNumericParam("amp_random", 0, 0, 24)
    testNumericParam("rt_decay", 0, 0, 200)
    testNumericParam("output", 0, 0, 1024)
    testNumericParam("xfin_lokey", 0, 0, 127)
    testNumericParam("xfin_hikey", 0, 0, 127)
    testNumericParam("xfout_lokey", 127, 0, 127)
    testNumericParam("xfout_hikey", 127, 0, 127)
    testTextParam("xf_keycurve", "power", ["gain", "power"])
    testTextParam("xf_velcurve", "power", ["gain", "power"])
    testTextParam("xf_cccurve", "power", ["gain", "power"])

    testNumericParam("ampeg_delay", 0, 0, 100)
    testNumericParam("ampeg_start", 0, 0, 100)
    testNumericParam("ampeg_attack", 0, 0, 100)
    testNumericParam("ampeg_hold", 0, 0, 100)
    testNumericParam("ampeg_decay", 0, 0, 100)
    testNumericParam("ampeg_sustain", 100, 0, 100)
    testNumericParam("ampeg_release", 0, 0, 100)
    testNumericParam("ampeg_vel2delay", 0, -100, 100)
    testNumericParam("ampeg_vel2attack", 0, -100, 100)
    testNumericParam("ampeg_vel2hold", 0, -100, 100)
    testNumericParam("ampeg_vel2decay", 0, -100, 100)
    testNumericParam("ampeg_vel2sustain", 0, -100, 100)
    testNumericParam("ampeg_vel2release", 0, -100, 100)

    testNumericParam("amplfo_delay", 0, 0, 100)
    testNumericParam("amplfo_fade", 0, 0, 100)
    testNumericParam("amplfo_freq", 0, 0, 20)
    testNumericParam("amplfo_depth", 0, -10, 10)
    testNumericParam("amplfo_depthchanaft", 0, -10, 10)
    testNumericParam("amplfo_depthpolyaft", 0, -10, 10)
    testNumericParam("amplfo_freqchanaft", 0, -200, 200)
    testNumericParam("amplfo_freqpolyaft", 0, -200, 200)

    testNumericParam("eq1_freq", 50, 0, 30000)
    testNumericParam("eq2_freq", 500, 0, 30000)
    testNumericParam("eq3_freq", 5000, 0, 30000)
    testNumericParam("eq1_vel2freq", 0, -30000, 30000)
    testNumericParam("eq2_vel2freq", 0, -30000, 30000)
    testNumericParam("eq3_vel2freq", 0, -30000, 30000)
    testNumericParam("eq1_bw", 1, 0.001, 4)
    testNumericParam("eq2_bw", 1, 0.001, 4)
    testNumericParam("eq3_bw", 1, 0.001, 4)
    testNumericParam("eq1_gain", 0, -96, 24)
    testNumericParam("eq2_gain", 0, -96, 24)
    testNumericParam("eq3_gain", 0, -96, 24)
    testNumericParam("eq1_vel2gain", 0, -96, 24)
    testNumericParam("eq2_vel2gain", 0, -96, 24)
    testNumericParam("eq3_vel2gain", 0, -96, 24)

    testNumericParam("effect1", 0, 0, 100)
    testNumericParam("effect2", 0, 0, 100)

    //_([0, 127]).each(function(i){
      //testNumericParam("on_locc" + i, -1, 0, 127)
      //testNumericParam("on_hicc" + i, -1, 0, 127)
      //testNumericParam("delay_cc" + i, 0, 0, 100)
      //testNumericParam("offset_cc" + i, 0, 0, MAX_INT)
      //testNumericParam("pitchlfo_depthcc" + i, 0, -1200, 1200)
      //testNumericParam("pitchlfo_freqcc" + i, 0, -200, 200)
      //testNumericParam("cutoff_cc" + i, 0, -MAX_BEND, MAX_BEND)
      //testNumericParam("fillfo_depthcc" + i, 0, -1200, 1200)
      //testNumericParam("fillfo_freqcc" + i, 0, -200, 200)
      //testNumericParam("amp_velcurve_" + 1, 1, 0, 1)
      //testNumericParam("gain_cc" + i, 0, -144, 48)
      //testNumericParam("xfin_locc" + i, 0, 0, 127)
      //testNumericParam("xfin_hicc" + i, 0, 0, 127)
      //testNumericParam("xfout_locc" + i, 0, 0, 127)
      //testNumericParam("xfout_hicc" + i, 0, 0, 127)
      //testNumericParam("ampeg_delaycc" + i, 0, -100, 100)
      //testNumericParam("ampeg_startcc" + i, 0, -100, 100)
      //testNumericParam("ampeg_attackcc" + i, 0, -100, 100)
      //testNumericParam("ampeg_holdcc" + i, 0, -100, 100)
      //testNumericParam("ampeg_decaycc" + i, 0, -100, 100)
      //testNumericParam("ampeg_sustaincc" + i, 100, -100, 100)
      //testNumericParam("ampeg_releasecc" + i, 0, -100, 100)
      //testNumericParam("amplfo_depthcc" + i, 0, -10, 10)
      //testNumericParam("amplfo_freqcc" + i, 0, -200, 200)
      //testNumericParam("eq1_freqcc" + i, 0, -30000, 30000)
      //testNumericParam("eq2_freqcc" + i, 0, -30000, 30000)
      //testNumericParam("eq3_freqcc" + i, 0, -30000, 30000)
      //testNumericParam("eq1_bwcc" + i, 0, -4, 4)
      //testNumericParam("eq2_bwcc" + i, 0, -4, 4)
      //testNumericParam("eq3_bwcc" + i, 0, -4, 4)
      //testNumericParam("eq1_gaincc" + i, 0, -96, 48)
      //testNumericParam("eq2_gaincc" + i, 0, -96, 48)
      //testNumericParam("eq3_gaincc" + i, 0, -96, 48)
    //})
  })

  describe("defaultValues", function(){
    it("is the default value for all parameters", function(){
      expect(subject.defaultValues.lochan).eql(subject.defaults.lochan.value)
    })
  })

  context("after initialization", function(){
    beforeEach(function(){
      this.subject = new subject()
    })
  })
})
