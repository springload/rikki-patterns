"use strict";

const nunjucks = require('nunjucks');
const marked = require('marked');
const beautify = require('js-beautify').html;
const PROD = (process.env.NODE_ENV === 'production');
const Path = require('path');


// relative to project root.
const TEMPLATE_PATHS = [
    Path.join(__dirname, 'templates'),
    Path.join(__dirname, 'pages'),
];

const TEMPLATE_OPTIONS = {
    autoescape: true,
    watch: !PROD
}


const TEMPLATE_FILTERS = {
  'json': (str) => {
    return JSON.stringify(str);
  },
  'markdown': (str) => {
    if (!str) {
        return '';
    }

    return marked(str);
  },
  'pretty': (str) => {
      return beautify(str);
  }
}


const TemplateRenderer = {
    configure(app) {
        if (app) {
            TEMPLATE_OPTIONS.express = app;
        }

        var templateEnv = nunjucks.configure(TEMPLATE_PATHS, TEMPLATE_OPTIONS);

        for (let filterName in TEMPLATE_FILTERS) {
          templateEnv.addFilter(filterName, TEMPLATE_FILTERS[filterName]);
        }

        return templateEnv;
    }
}


module.exports = TemplateRenderer;
