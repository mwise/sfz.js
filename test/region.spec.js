var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , subject = require("../src/region")
  , Parameter = require("../src/parameter")

describe(subject.name, function(){

  context("after initialization", function(){
    beforeEach(function(){
      this.subject = new subject()
    })

    it("has a sample", function(){
      expect(this.subject.sample).instanceof(Object)
    })

    it("has input controls", function(){
      expect(this.subject.inputControls).instanceof(Object)
    })

    it("has performanceParameters", function(){
      expect(this.subject.performanceParameters).instanceof(Object)
    })


    describe("noteOn()", function(){


    })

  })
})
