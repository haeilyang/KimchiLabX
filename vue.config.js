const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "dist",  // Netlify는 dist 폴더를 배포함
  publicPath: '/',     // Netlify에서는 '/'로 설정해야 정상적으로 동작
});
