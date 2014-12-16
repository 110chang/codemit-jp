({
  baseUrl: ".",
  name: "main",
  out: "all.js",
  optimize: "none",
  paths: {
    'mod'      : 'mod',
    'lib'      : 'lib',
    'domReady' : 'lib/require/domReady',
    'tween'    : 'lib/tween.min'
  }
})