module.exports = {
  "PORT": 4000,
  "proxy": 5000,
  "paths": {
    "components": "./ui/components",
    "generator": {
      "template": "./scripts/generator/**/*"
    },
    "staticSite": {
      "root": "./www",
      "static": "./www/static"
    },
    "site": {
      "pages": "./app/pages",
      "static": "./app/static"
    },
    "ui": {
      "swatches": "./ui/swatches",
      "tokens": "./ui/tokens/",
      "aliases": "./ui/tokens/aliases.json",
      "scss": "./ui/scss",
      "tokensScss": "_tokens.scss"
    }
  },
  "swatches": {
    "sketch": "swatches-sketch.sketchpalette",
    "adobe": "swatches-adobe.ase"
  },
  "app": {
    "title": "Pattern Library",
    "seo": {
      "title": "Pattern Library"
    }
  }
}
