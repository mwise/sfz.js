var tests = ["test/client/spec_helper"];

for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\.spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    baseUrl: '/base',

    paths: {
      "sfz": "out/sfz"
    },

    shim: {},

    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
