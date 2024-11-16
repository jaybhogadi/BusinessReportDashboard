const { override } = require('customize-cra');
const path = require('path-browserify');

module.exports = override((config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": require.resolve("path-browserify"),
  };
  return config;
});
