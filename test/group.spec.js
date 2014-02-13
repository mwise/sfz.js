var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , subject = require("../src/group")

describe(subject.name, function(){
  context("after initialization", function(){
    beforeEach(function(){
      this.subject = new subject()
    })

    it("has regions", function(){
      expect(this.subject.regions).instanceof(Array)
    })
  })
})
