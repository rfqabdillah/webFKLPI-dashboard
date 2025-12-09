  const { defineConfig } = require('@vue/cli-service');

  module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
    transpileDependencies: true,
    devServer: {
      proxy: {
        '/api': {
          target: process.env.VUE_APP_ENDPOINT_API_SERVER,
          changeOrigin: true,
          pathRewrite: {
            '^/api': process.env.VUE_APP_PROXY_PATH_REWRITE,
          },
        },
      },
    }
  });