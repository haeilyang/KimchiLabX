const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    dotenv: true
  },
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        'process.env.VUE_APP_OPENAI_API_KEY': JSON.stringify(process.env.VUE_APP_OPENAI_API_KEY)
      })
    ]
  }
});
