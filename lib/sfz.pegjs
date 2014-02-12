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
        type:     "Instrument",
        groups: groups,
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
  / "lochan=" value:Integer { return { lochan: value } }
  / "hichan=" value:Integer { return { hichan: value } }
  / "lokey=" value:MidiNoteValue { return { lokey: value } }
  / "hikey=" value:MidiNoteValue { return { hikey: value } }
  / "key=" value:MidiNoteValue {
    return { lokey: value, hikey: value }
  }
  / "lovel=" value:Integer { return { lovel: value } }
  / "hivel=" value:Integer { return { hivel: value } }
  / "lobend=" value:Integer { return { lobend: value } }
  / "hibend=" value:Integer { return { hibend: value } }
  / "lochanaft=" value:Integer { return { lochanaft: value } }
  / "hichanaft=" value:Integer { return { hichanaft: value } }
  / "lopolyaft=" value:Integer { return { lopolyaft: value } }
  / "hipolyaft=" value:Integer { return { hipolyaft: value } }
  / "lorand=" value:Float { return { lorand: value } }
  / "hirand=" value:Float { return { hirand: value } }
  / "lobpm=" value:Float { return { lobpm: value } }
  / "hibpm=" value:Float { return { hibpm: value } }
  / "seq_length=" value:Integer { return { seq_length: value } }
  / "seq_position=" value:Integer { return { seq_position: value } }
  / "sw_lokey=" value:MidiNoteValue { return { sw_lokey: value } }
  / "sw_hikey=" value:MidiNoteValue { return { sw_hikey: value } }
  / "sw_last=" value:MidiNoteValue { return { sw_last: value } }
  / "sw_down=" value:MidiNoteValue { return { sw_down: value } }
  / "sw_up=" value:MidiNoteValue { return { sw_up: value } }
  / "sw_previous=" value:MidiNoteValue { return { sw_previous: value } }
  / "sw_vel=" value:("current" / "previous") { return { sw_vel: value } }
  / "sw_trigger=" value:(
    "attack" / "release" / "first" / "legato"
  ) { return { sw_trigger: value } }
  / "group=" value:Integer { return { group: value } }
  / "off_by=" value:Integer { return { off_by: value } }
  / "off_mode=" value:("fast" / "normal") { return { off_mode: value } }
  / "delay=" value:Float { return { delay: value } }
  / "delay_random=" value:Float { return { delay_random: value } }
  / DelayCcDirective
  / "offset=" value:Integer { return { offset: value } }
  / "offset_random=" value:Integer { return { offset_random: value } }
  / OffsetCcDirective
  / "end=" value:Integer { return { end: value } }
  / "count=" value:Integer { return { count: value } }
  / LoopModeDirective
  / "loop_start=" value:Integer { return { loop_start: value } }
  / "loop_end=" value:Integer { return { loop_end: value } }
  / "sync_beats=" value:Float { return { sync_beats: value } }
  / "sync_offset=" value:Float { return { sync_offset: value } }
  / "transpose=" value:Integer { return { transpose: value } }
  / "tune=" value:Integer { return { tune: value } }
  / "pitch_keycenter=" value:Integer { return { pitch_keycenter: value } }
  / "pitch_keytrack=" value:Integer { return { pitch_keytrack: value } }
  / "pitch_veltrack=" value:Integer { return { pitch_veltrack: value } }
  / "pitch_random=" value:Integer { return { pitch_random: value } }
  / "bend_up=" value:Integer { return { bend_up: value } }
  / "bend_down=" value:Integer { return { bend_down: value } }
  / "pitcheg_delay=" value:Float { return { pitcheg_delay: value } }
  / "pitcheg_start=" value:Float { return { pitcheg_start: value } }
  / "pitcheg_attack=" value:Float { return { pitcheg_attack: value } }
  / "pitcheg_hold=" value:Float { return { pitcheg_hold: value } }
  / "pitcheg_decay=" value:Float { return { pitcheg_decay: value } }
  / "pitcheg_sustain=" value:Float { return { pitcheg_sustain: value } }
  / "pitcheg_release=" value:Float { return { pitcheg_release: value } }
  / "pitcheg_depth=" value:Integer { return { pitcheg_depth: value } }
  / "pitcheg_vel2delay=" value:Float { return { pitcheg_vel2delay: value } }
  / "pitcheg_vel2attack=" value:Float { return { pitcheg_vel2attack: value } }
  / "pitcheg_vel2hold=" value:Float { return { pitcheg_vel2hold: value } }
  / "pitcheg_vel2decay=" value:Float { return { pitcheg_vel2decay: value } }
  / "pitcheg_vel2sustain=" value:Float { return { pitcheg_vel2sustain: value } }
  / "pitcheg_vel2depth=" value:Integer { return { pitcheg_vel2depth: value } }

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
