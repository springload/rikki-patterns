const path = require('path');
const package = require('../package.json');

const PROD = process.env.NODE_ENV === 'production';

const uiPath = path.join(process.cwd(), 'client', 'ui');

module.exports = {
    DEBUG: !PROD,
    paths: {
        // TODO Move to ui
        components: path.join(uiPath, 'components'),
        generator: {
            template: path.join(__dirname, 'scripts', 'generator', '**', '*'),
        },
        staticSite: {
            root: path.join(__dirname, 'www'),
            static: path.join(__dirname, 'www', 'static'),
        },
        site: {
            templates: path.join(__dirname, 'site', 'templates'),
            pages: path.join(__dirname, 'site', 'pages'),
            static: path.join(__dirname, 'site', 'static'),
            css: path.join(__dirname, 'site', 'static', 'css'),
            scss: path.join(__dirname, 'site', 'scss'),
        },
        ui: {
            root: uiPath,
            components: path.join(uiPath, 'components'),
            swatches: path.join(uiPath, 'swatches'),
            tokens: path.join(uiPath, 'tokens'),
            aliases: path.join(uiPath, 'tokens', 'aliases.json'),
            css: path.join(uiPath, 'css'),
            scss: path.join(uiPath, 'scss'),
            tokensScss: '_tokens.scss',
        },
    },
    swatches: {
        sketch: 'swatches-sketch.sketchpalette',
        adobe: 'swatches-adobe.ase',
    },
    app: {
        title: 'Rikki Design System',
        seo: {
            title: 'Rikki Patterns',
        },
    },
    package: package,
};
