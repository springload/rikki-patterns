const nunjucks = require('@springload/nunjucks');
const config = require('../config');
const filters = require('./filters');

const TEMPLATE_PATHS = [
    config.paths.site.templates,
    config.paths.site.pages,
    config.paths.ui.root,
    config.paths.ui.components,
];

const TEMPLATE_OPTIONS = {
    autoescape: true,
    watch: config.DEBUG,
};

module.exports = {
    configure(app) {
        if (app) {
            TEMPLATE_OPTIONS.express = app;
        }

        nunjucks.installJinjaCompat();

        const templateEnv = nunjucks.configure(
            TEMPLATE_PATHS,
            TEMPLATE_OPTIONS,
        );

        Object.keys(filters).forEach(name => {
            templateEnv.addFilter(name, filters[name]);
        });

        return templateEnv;
    },
};
