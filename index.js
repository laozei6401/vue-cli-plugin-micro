const { version } = require("webpack")

const cssLangs = ["css", "postcss", "sass", "scss", "less", "stylus"]

function updateCssRule(rule, publicPath) {
  rule.use("extract-css-loader").tap(options => {
    if (options) {
      options.publicPath = publicPath
    }

    return options
  })
}

/**
 * @type { import("@vue/cli-service").ServicePlugin }
 */
module.exports = (api, rootOptions) => {
  api.chainWebpack(webpackConfig => {
    const pkg = api.resolve("package.json")
    const isProduction = process.env.NODE_ENV === "production"
    const { publicPath } = rootOptions

    /**
     * 修改css中的publicPath
     */
    if (publicPath && isProduction) {
      cssLangs.forEach(lang => {
        const baseRule = webpackConfig.module.rule(lang)

        const normalRule = baseRule.oneOf("normal")
        const vueNormalRule = baseRule.oneOf("vue").resourceQuery(/\?vue/)
        const vueModulesRule = baseRule.oneOf("vue-modules").resourceQuery(/module/)
        const extModulesRule = baseRule.oneOf("normal-modules").test(/\.module\.\w+$/)

        updateCssRule(normalRule, publicPath)
        updateCssRule(vueNormalRule, publicPath)
        updateCssRule(vueModulesRule, publicPath)
        updateCssRule(extModulesRule, publicPath)
      })
    }

    /**
     * 设置跨域头
     */
    webpackConfig.devServer.compress(true).headers({
      "Access-Control-Allow-Origin": "*"
    })

    /**
     * 设置qiankun导出配置
     */
    webpackConfig.output.library(`${pkg.name}-[name]`).libraryTarget("umd")

    webpackConfig.when(version < 5, webpackConfig => {
      // webpack5移除了这些配置
      // webpackConfig.devServer.disableHostCheck(true)
      webpackConfig.output.jsonpFunction(`webpackJsonp_${pkg.name}`)
    })
  })
}
