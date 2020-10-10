// vue.config.js
module.exports = {
  devServer: {
    proxy: 'https://www.metaweather.com'
  },
  assetsDir: '',
  css: {
    loaderOptions: {
      sass: {
        prependData: ' @import "@/assets/styles/styles.scss"; '
      }
    }
  }
}
