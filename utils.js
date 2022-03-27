const url = require("url")

function isAbsoluteUrl(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//"
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

function resolvePublicPath(publicPath) {
  let domain = process.env.VUE_APP_DOMAIN

  if (typeof publicPath !== "string") {
    publicPath = "/"
  }

  if (isAbsoluteUrl(publicPath) || !isAbsoluteUrl(domain)) {
    return publicPath
  }

  if (process.env.VUE_APP_PUBLIC_PLACEHOLDER) {
    domain = process.env.VUE_APP_PUBLIC_PLACEHOLDER
  }

  return url.resolve(publicPath, domain)
}

module.exports = {
  resolvePublicPath
}
