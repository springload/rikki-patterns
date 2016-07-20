// =============================================================================
// Dependencies
// ============================================================================= =

const config = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
const nunjucks = require('nunjucks');
const marked = require('marked');
const reactRender = require('react-render');
const changeCase = require('change-case');
const Path = require('path');
const favicon = require('serve-favicon');
const templates = require('./templates');
const views =  require('./views');
const errors = require('./utils/errors');


// =============================================================================
// Constants
// =============================================================================

const DEBUG = process.env.NODE_ENV !== 'production';
const staticPath = Path.join(__dirname, 'static');

const app = express();

templates.configure(app);

// =============================================================================
// Middleware
// =============================================================================

app.use(bodyParser.json());
app.use(favicon(Path.join(staticPath, 'favicon.ico')));


// =============================================================================
// Routes
// =============================================================================

const routePaths = {
  raw: [
      '/raw/:name/:flavour/:variant',
      '/raw/:name/:flavour',
      '/raw/:name'
  ],
  component: [
      '/components/:name',
      '/components/:name/:flavour',
      '/components/:name/:flavour/:variant'
  ],
  generic: /^(.*)$/,
  static: '/static'
}

app.use(routePaths.static, express.static(staticPath));
app.get(routePaths.raw, views.componentRawView);
app.get(routePaths.component, views.componentOverviewView);
app.get(routePaths.generic, views.generic);

// =============================================================================
// Error handling
// =============================================================================

app.use(errors.logError);
app.use(errors.default404);
app.use(errors.handle404);

module.exports = app;
