const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api-inference.huggingface.co',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api from the path
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add the authorization header to the proxy request
        proxyReq.setHeader('Authorization', 'Bearer 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');
      },
    })
  );
};
