const path = require('path');
const readPkgUp = require('read-pkg-up');
const cosmiconfig = require('cosmiconfig');

const pkg = require('../package.json');

const targetPkg = readPkgUp.sync().pkg;

const PROD = process.env.NODE_ENV === 'production';

const rikkiConfigDefaults = {
    title: `${targetPkg.name} Pattern Library`,
    verbose: true,
    rootDir: 'client/pattern-library',
    staticDir: 'client/static',
};

const rikkiConfig = Object.assign(
    {},
    rikkiConfigDefaults,
    cosmiconfig('rikki', {
        sync: true,
    }),
);

const uiPath = path.join(process.cwd(), rikkiConfig.rootDir);
const staticPath = path.join(process.cwd(), rikkiConfig.staticDir);

module.exports = {
    DEBUG: !PROD,
    paths: {
        generator: {
            template: path.join(__dirname, 'scripts', 'generator', '**', '*'),
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
        },
        staticSite: {
            root: staticPath,
            static: staticPath,
        },
    },
    // Names of the output files for Sketch and Adobe versions of our tokens.
    swatches: {
        sketch: 'swatches-sketch.sketchpalette',
        adobe: 'swatches-adobe.ase',
        scss: '_tokens.scss',
    },
    app: {
        title: rikkiConfig.title,
        seo: {
            title: rikkiConfig.title,
        },
    },
    pkg: pkg,
    targetPkg: targetPkg,
};
