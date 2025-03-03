const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "docs",  // 🔹 빌드 결과를 docs/ 폴더에 저장
  publicPath: process.env.NODE_ENV === 'production' ? '/KimchiLabX/' : '/',
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
