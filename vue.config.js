  const { defineConfig } = require('@vue/cli-service');

  module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
    transpileDependencies: true,
    devServer: {
      proxy: {
        '/api': {
          target: 'http://37.44.244.19',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api_website_produktivitas', 
          },
        },
      },
    }
  });
  