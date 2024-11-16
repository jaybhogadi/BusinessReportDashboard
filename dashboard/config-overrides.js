module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // 'fs' is not needed in the browser
      path: require.resolve('path-browserify') // Correctly resolve the 'path-browserify' module
    };
    return config;
  };
  