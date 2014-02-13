var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , subject = require("../src/sfz")

describe(subject.name, function(){
  it("defines an instrument", function(){
    expect(subject.Instrument).ok
  })
})
