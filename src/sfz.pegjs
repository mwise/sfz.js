start
  = __ instrument:Instrument __ { return instrument; }

Instrument
  = elements:SourceElements? {

      function extend(target, source){
        target = target || {};
        for (var prop in source) {
          if (typeof source[prop] === 'object') {
            target[prop] = extend(target[prop], source[prop]);
          } else {
            target[prop] = source[prop];
          }
        }
        return target;
      }

      elements = elements !== null ? elements : [];
      var groups = [];
      var regions = [];
      for (var i = 0; i < elements.length; i++) {
        if (elements[i] == '<group>') {
          groups.push({})
        } else if (elements[i] == "<region>") {
          if (groups.length) {
            regions.push(groups[groups.length - 1])
          } else {
            regions.push({})
          }
        } else {
          var param = elements[i]
            , name = param[0]
            , value = param[1]
          if (groups.length) {
            extend(groups[groups.length - 1], elements[i])
          }
          if (regions.length) {
            extend(regions[regions.length - 1], elements[i])
          }
        }
      }
      return {
        type: "Instrument",
        regions: regions
      };
    }

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
      return result;
    }

SourceElement
  = Comment
  / Header
  / OpcodeDirective

SourceCharacter
  = .

Header
 = Region / Group

Region
 = "<region>"

Group
 = "<group>"

OpcodeDirective
  = "sample=" value:Filepath { return { sample: value } }
  / "key=" value:MidiNoteValue {
    return { lokey: value, hikey: value }
  }
  / "sw_vel=" value:("current" / "previous") { return { sw_vel: value } }
  / "sw_trigger=" value:(
    "attack" / "release" / "first" / "legato"
  ) { return { sw_trigger: value } }
  / "off_mode=" value:("fast" / "normal") { return { off_mode: value } }
  / DelayCcDirective
  / OffsetCcDirective
  / LoopModeDirective
  / PitchLfoDepthCcDirective
  / PitchLfoFreqCcDirective
  / "fil_type=" value:(
    "lpf_1p" / "hpf_1p" / "lpf_2p" / "hpf_2p" / "bpf_2p" / "brf_2p"
    ) { return { fil_type: value } }
  / CutoffCcDirective
  / MidiNoteOpcodeDirective
  / FloatOpcodeDirective
  / IntegerOpcodeDirective
  / CurveOpcodeDirective
  / SequentialFloatDirective
  / SequentialIntegerDirective

MidiNoteOpcodeDirective
  = name:MidiNoteOpcode "=" value:MidiNoteValue {
    var param = {}
    param[name] = value
    return param
  }

FloatOpcodeDirective
  = name:FloatOpcode "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

IntegerOpcodeDirective
  = name:IntegerOpcode "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

CurveOpcodeDirective
  = name:CurveOpcode "=" value:("gain" / "power") {
    var param = {}
    param[name] = value
    return param
  }

CurveOpcode
  = "xf_keycurve"
  / "xf_velcurve"
  / "xf_cccurve"

MidiNoteOpcode
  = "lokey"
  / "hikey"
  / "sw_lokey"
  / "sw_hikey"
  / "sw_last"
  / "sw_down"
  / "sw_up"
  / "sw_previous"

FloatOpcode
  = "fillfo_delay"
  / "fillfo_fade"
  / "fillfo_freq"
  / "fillfo_freqcc1"
  / "fillfo_freqcc2"
  / "lorand"
  / "hirand"
  / "lobpm"
  / "hibpm"
  / "delay_random"
  / "delay_cc1"
  / "delay_cc2"
  / "delay"
  / "sync_beats"
  / "sync_offset"
  / "pitcheg_delay"
  / "pitcheg_start"
  / "pitcheg_attack"
  / "pitcheg_hold"
  / "pitcheg_decay"
  / "pitcheg_sustain"
  / "pitcheg_release"
  / "pitcheg_vel2delay"
  / "pitcheg_vel2attack"
  / "pitcheg_vel2hold"
  / "pitcheg_vel2decay"
  / "pitcheg_vel2sustain"
  / "pitchlfo_delay"
  / "pitchlfo_fade"
  / "pitchlfo_freqcc1"
  / "pitchlfo_freqcc60"
  / "pitchlfo_freqchanaft"
  / "pitchlfo_freqpolyaft"
  / "pitchlfo_freq"
  / "cutoff"
  / "resonance"
  / "fileg_delay"
  / "fileg_start"
  / "fileg_attack"
  / "fileg_hold"
  / "fileg_decay"
  / "fileg_sustain"
  / "fileg_release"
  / "fileg_vel2delay"
  / "fileg_vel2attack"
  / "fileg_vel2hold"
  / "fileg_vel2decay"
  / "fileg_vel2sustain"
  / "fileg_vel2release"
  / "volume"
  / "pan"
  / "width"
  / "position"
  / "amp_keytrack"
  / "amp_veltrack"
  / "amp_velcurve_1"
  / "amp_velcurve_127"
  / "amp_random"
  / "rt_decay"
  / "ampeg_delay"
  / "ampeg_start"
  / "ampeg_attack"
  / "ampeg_hold"
  / "ampeg_decay"
  / "ampeg_sustain"
  / "ampeg_release"
  / "ampeg_vel2delay"
  / "ampeg_vel2attack"
  / "ampeg_vel2hold"
  / "ampeg_vel2decay"
  / "ampeg_vel2sustain"
  / "ampeg_vel2release"
  / "amplfo_delay"
  / "amplfo_fade"
  / "amplfo_depthchanaft"
  / "amplfo_depthpolyaft"
  / "amplfo_depth"
  / "amplfo_freqchanaft"
  / "amplfo_freqpolyaft"
  / "amplfo_freq"
  / "eq1_freq"
  / "eq2_freq"
  / "eq3_freq"
  / "eq1_vel2freq"
  / "eq2_vel2freq"
  / "eq3_vel2freq"
  / "eq1_bw"
  / "eq2_bw"
  / "eq3_bw"
  / "eq1_gain"
  / "eq2_gain"
  / "eq3_gain"
  / "eq1_vel2gain"
  / "eq2_vel2gain"
  / "eq3_vel2gain"
  / "effect1"
  / "effect2"

IntegerOpcode
  = "fillfo_depthcc1"
  / "fillfo_depthcc60"
  / "fillfo_freqchanaft"
  / "fillfo_freqpolyaft"
  / "fillfo_freqchanaft"
  / "fillfo_freqpolyaft"
  / "fillfo_depth"
  / "lovel"
  / "hivel"
  / "lobend"
  / "hibend"
  / "lochanaft"
  / "hichanaft"
  / "lochan"
  / "hichan"
  / "lopolyaft"
  / "hipolyaft"
  / "seq_length"
  / "seq_position"
  / "group"
  / "off_by"
  / "offset_random"
  / "offset_cc1"
  / "offset_cc64"
  / "offset"
  / "end"
  / "count"
  / "loop_start"
  / "loop_end"
  / "transpose"
  / "tune"
  / "tune"
  / "pitch_keycenter"
  / "pitch_keycenter"
  / "pitch_keytrack"
  / "pitch_keytrack"
  / "pitch_veltrack"
  / "pitch_veltrack"
  / "pitch_random"
  / "pitch_random"
  / "bend_up"
  / "bend_up"
  / "bend_down"
  / "bend_down"
  / "pitcheg_depth"
  / "fileg_depth"
  / "fileg_vel2depth"
  / "fil_keytrack"
  / "fil_keycenter"
  / "fil_veltrack"
  / "fil_random"
  / "cutoff_cc1"
  / "cutoff_cc2"
  / "cutoff_chanaft"
  / "cutoff_polyaft"
  / "pitchlfo_depthcc1"
  / "pitchlfo_depthcc60"
  / "pitchlfo_depthchanaft"
  / "pitchlfo_depthpolyaft"
  / "pitchlfo_depth"
  / "pitcheg_vel2depth"
  / "amp_keycenter"
  / "output"
  / "xfin_lokey"
  / "xfin_hikey"
  / "xfin_lovel"
  / "xfin_hivel"
  / "xfout_lovel"
  / "xfout_hivel"


SequentialFloatDirective
 = name:(n:SequentialFloatOpcode i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

SequentialIntegerDirective
 = name:(n:SequentialIntegerOpcode i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

SequentialFloatOpcode
  = "fillfo_freqcc"
  / "gain_cc"
  / "ampeg_delaycc"
  / "ampeg_startcc"
  / "ampeg_attackcc"
  / "ampeg_holdcc"
  / "ampeg_decaycc"
  / "ampeg_sustaincc"
  / "ampeg_releasecc"
  / "amplfo_depthcc"
  / "amplfo_freqcc"
  / "eq1_freqcc"
  / "eq2_freqcc"
  / "eq3_freqcc"
  / "eq1_bwcc"
  / "eq2_bwcc"
  / "eq3_bwcc"
  / "eq1_gaincc"
  / "eq2_gaincc"
  / "eq3_gaincc"
  / "amp_velcurve_"
  / "amp_velcurve_"

SequentialIntegerOpcode
  = "fillfo_depthcc"
  / "xfin_locc"
  / "xfin_hicc"
  / "xfout_locc"
  / "xfout_hicc"

DelayCcDirective
  = name:(n:"delay_cc" i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

OffsetCcDirective
  = name:(n:"offset_cc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

PitchLfoDepthCcDirective
  = name:(n:"pitchlfo_depthcc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

PitchLfoFreqCcDirective
  = name:(n:"pitchlfo_freqcc" i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

CutoffCcDirective
  = name:(n:"cutoff_cc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

LoopModeDirective
  = "loop_mode" "=" value:(
    "no_loop" / "one_shot" / "loop_continuous" / "loop_sustain"
  ) { return { loop_mode: value } }

MidiNoteValue
 = Integer / MidiNoteName

Integer
  = SignedIntegerAsNumber

Float
  = SignedDecimalLiteral

DecimalDigits
  = DecimalDigit+

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = [eE]

SignedInteger
  = [-+]? DecimalDigits

SignedIntegerAsNumber
  = sign:[-+]? digits:DecimalDigits {
    sign = sign || ""
    return parseInt(sign + digits.join(""), 10)
  }

DecimalLiteral
  = parts:$(DecimalIntegerLiteral "." DecimalDigits? ExponentPart?) {
      return parseFloat(parts);
    }
  / parts:$("." DecimalDigits ExponentPart?)     { return parseFloat(parts); }
  / parts:$(DecimalIntegerLiteral ExponentPart?) { return parseFloat(parts); }

DecimalIntegerLiteral
  = "0" / NonZeroDigit DecimalDigits?

SignedDecimalLiteral
 = sign:[-+]? decimal:DecimalLiteral {
   sign = sign || ""
  return parseFloat(sign + decimal)
 }

MidiNoteName
  = note:[a-gA-G] accidental:[#b]? octave:SignedInteger {
    accidental = accidental || ""
    return note + accidental + octave.join("")
  }

Filepath
 = name:Filename ext:FileExtension { return name + ext }

Filename
 = chars:(!FileExtension c:SourceCharacter { return c })+ {
   return chars.join("")
 }

FileExtension
  = ".wav" / ".ogg"

/* ===== A.1 Lexical Grammar ===== */

WhiteSpace "whitespace"
  = [\t\v\f \u00A0\uFEFF]
  / Zs

// Separator, Space
Zs = [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

Comment "comment"
  = SingleLineComment

SingleLineComment
  = "/" (!LineTerminator SourceCharacter)*

EOS
  = _ LineTerminatorSequence
  / __ EOF

EOSNoLineTerminator
  = _ LineTerminatorSequence
  / _ EOF

EOF
  = !.

/* Whitespace */

_
  = (WhiteSpace / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*
