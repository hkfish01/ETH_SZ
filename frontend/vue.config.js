const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/whiskyrwa',
  chainWebpack: config =>{
    config.plugin('html').tap(args => {
      args[0].title = '';
      return args;
    })
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [require('tailwindcss'), require('autoprefixer')]
        }
      }
    }
  },
  devServer: {
    proxy: {
      '/prod-api': {
        target : 'http://116.196.89.134:8080',
        changeOrigin : true
      },
      "/nft-api": {
        target: "http://94.190.229.193:3016",
        pathRewrite: {
          "^/nft-api": "",
        },
      }
    },
  }
})
