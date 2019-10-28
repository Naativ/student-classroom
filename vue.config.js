const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        template: `public/index.html`
      })
    ],
    devServer: {
      disableHostCheck: true
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'lang',
      enableInSFC: false
    }
  }
}
