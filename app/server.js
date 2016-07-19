// =============================================================================
// Dependencies
// =============================================================================

import config from './config';
import bodyParser from 'body-parser';
import express from 'express';
import nunjucks from 'nunjucks';
import marked from 'marked';
import reactRender from 'react-render';
import changeCase from 'change-case';
import Path from 'path';
import favicon from 'serve-favicon';

import templates from './templates';
import * as views from './views';
import * as errors from './utils/errors';


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
