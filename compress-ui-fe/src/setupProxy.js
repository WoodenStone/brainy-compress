/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

/** @format */

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_ENDPOINT,
      changeOrigin: true,
      hostRewrite: false,
      pathRewrite: {
        '^/api': '',
      },
    }),
  )
}
