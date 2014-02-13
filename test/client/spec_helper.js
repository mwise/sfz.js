define(function(require, exports, module){
  window.mock = sinon.mock
  window.spy = sinon.spy
  window.stub = sinon.stub

  chai.Assertion.includeStack = true

  //window.SinonMocha.enhance(window.sinon)
  //var sinonChai = require("sinon-chai")
  //chai.use(sinonChai)
})
