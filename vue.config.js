const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    dotenv: true // `.env` 파일을 로드하도록 설정
  }
})
