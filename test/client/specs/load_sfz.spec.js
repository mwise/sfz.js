define(function(require, exports, module){

  var sfz = require("sfz")
    , WebAudioSynth = sfz.WebAudioSynth

  describe("sfz", function(){

    it("is defined", function(){
      expect(sfz).ok
    })

    it("defines a parse() function", function(){
      expect(sfz.parse).ok
    })

    it("defines an Instrument", function(){
      expect(sfz.Instrument).ok
    })

  })
})
