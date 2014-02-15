var chai = require("chai")
  , expect = chai.expect
  , context = describe
  , subject = require("../src/instrument")
  , Region = require("../src/region")
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai")
  , stub = sinon.stub

chai.use(sinonChai)

describe(subject.name, function(){

  context("after initialization", function(){
    context("when no regions options is present", function(){
      beforeEach(function(){
        this.subject = new subject()
      })

      it("has an empty regions array", function(){
        expect(this.subject.regions).eql([])
      })

      it("has a default pitch bend value", function(){
        expect(this.subject.bend).eql(0)
      })

      it("has a default channel aftertouch value", function(){
        expect(this.subject.chanaft).ok
      })

      it("has a default polyphonic aftertouch value", function(){
        expect(this.subject.polyaft).ok
      })

      it("has a default bpm value", function(){
        expect(this.subject.bpm).ok
      })

      it("has a default synth", function(){
        expect(this.subject.synth).ok
      })
    })

    context("when a regions options is present", function(){
      beforeEach(function(){
        this.regionDefinitions = [
          { lochan: 2, sample: "foo.wav" },
          { lochan: 3, sample: "bar.wav" }
        ]
        this.subject = new subject({
          regions: this.regionDefinitions
        })
      })

      it("creates regions as specified", function(){
        expect(this.subject.regions).length(2)
        expect(this.subject.regions[0].sample).eql("foo.wav")
        expect(this.subject.regions[0].lochan).eql(2)
      })
    })
  })

  describe("instance methods", function(){
    beforeEach(function(){
      this.subject = new subject()
    })

    describe("shouldPlayRegion()", function(){
      beforeEach(function(){
        this.region = new Region()
        this.noteOn = { channel: 8, pitch: 60, velocity: 100 }
        this.rand = .5
      })

      context("when the region has no sample", function(){
        beforeEach(function(){
          this.region.sample = null
        })

        it("is false", function(){
          expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
        })
      })

      context("when the region has a sample", function(){
        beforeEach(function(){
          this.region.sample = "foo.wav"
        })

        context("when lochan is out of range", function(){
          beforeEach(function(){
            this.region.lochan = this.noteOn.channel + 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when hichan is out of range", function(){
          beforeEach(function(){
            this.region.hichan = this.noteOn.channel - 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when lokey is out of range", function(){
          beforeEach(function(){
            this.region.lokey = this.noteOn.pitch + 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when hikey is out of range", function(){
          beforeEach(function(){
            this.region.hikey = this.noteOn.pitch - 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when lovel is out of range", function(){
          beforeEach(function(){
            this.region.lovel = this.noteOn.velocity + 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when hivel is out of range", function(){
          beforeEach(function(){
            this.region.hivel = this.noteOn.velocity - 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when lobend is out of range", function(){
          beforeEach(function(){
            this.region.lobend = this.subject.bend + 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when hibend is out of range", function(){
          beforeEach(function(){
            this.region.hibend = this.subject.bend - 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when lochanaft is out of range", function(){
          beforeEach(function(){
            this.region.lochanaft = this.subject.chanaft + 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when hichanaft is out of range", function(){
          beforeEach(function(){
            this.region.hichanaft = this.subject.chanaft - 1
          })

          it("is false", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).false
          })
        })

        context("when all input controls are in range", function(){
          beforeEach(function(){
            this.region.lochan = this.noteOn.channel - 1
            this.region.hichan = this.noteOn.channel + 1
            this.region.lokey = this.noteOn.pitch - 1
            this.region.hikey = this.noteOn.pitch + 1
            this.region.lovel = this.noteOn.velocity - 1
            this.region.hivel = this.noteOn.velocity + 1
            this.region.lobend  = this.subject.bend - 1
            this.region.hibend = this.subject.bend + 1
            this.region.lochanaft  = this.subject.chanaft - 1
            this.region.hichanaft = this.subject.chanaft + 1
            this.region.lopolyaft  = this.subject.polyaft - 1
            this.region.hipolyaft = this.subject.polyaft + 1
            this.region.lorand = this.rand - .1
            this.region.hirand = this.rand + .1
            this.region.lobpm = this.subject.bpm - 1
            this.region.hibpm = this.subject.bpm + 1
          })

          it("is true", function(){
            expect(this.subject.shouldPlayRegion(this.region, this.noteOn, this.rand)).true
          })
        })

      })
    })

    describe("regionsToPlay()", function(){
      beforeEach(function(){
        this.region1 = { foo: "bar" }
        this.region2 = { baz: "bat" }
        this.noteOn = { boy: "bob" }
        this.rand = .6
        this.subject.regions = [this.region1, this.region2]

        var shouldPlayRegionStub = stub()
        shouldPlayRegionStub.withArgs(this.region1, this.noteOn, this.rand).returns(true)
        shouldPlayRegionStub.withArgs(this.region2, this.noteOn, this.rand).returns(false)

        this.subject.shouldPlayRegion = shouldPlayRegionStub

      })

      it("selects regions that match the given input controls", function(){
        expect(this.subject.regionsToPlay(this.noteOn, this.rand)).eql([this.region1])
      })
    })

    describe("noteOn()", function(){
      beforeEach(function(){
        this.noteOn = { 
          channel: 1,
          pitch: 60,
          velocity: 100
        }
        stub(this.subject, "random").returns(.5)
        this.subject.play = stub()
        this.region1 = { play: stub() }
        stub(this.subject, "regionsToPlay").withArgs(this.noteOn, .5).returns([this.region1])
      })

      it("plays regions that match the input controls", function(){
        this.subject.noteOn(this.noteOn.channel, this.noteOn.pitch, this.noteOn.velocity)

        expect(this.subject.play).calledWith(this.region1, this.noteOn)
      })
    })

    describe("play()", function(){
      beforeEach(function(){
        this.subject.synth.play = stub()
      })

      it("delegates to the synth", function(){
        this.subject.play("foo", "bar")

        expect(this.subject.synth.play).calledWith("foo", "bar")
      })
    
    })

    describe("samples", function(){
      beforeEach(function(){
        this.subject.regions = [
          { sample: "foo.wav" },
          { sample: "bar.mp3" },
          {}
        ]
      })

      it("plucks sample values from the regions", function(){
        expect(this.subject.samples()).eql(["foo.wav", "bar.mp3"])
      })
    
    })
  })

})
