"use strict";

const _ = require('lodash');
const gutil = require('gulp-util');
const Path = require('path');
const transform = require('vinyl-transform')
const map = require('map-stream');
const concat = require('gulp-concat');
const fs = require('fs');
const rename = require('gulp-rename');
const nunjucks = require('nunjucks');

const utils = require('../../app/utils');
const navigation = require('../../app/navigation');
const templates = require('../../app/templates');
const config = require('../../app/config');
const prefix = require('./prefix');


var print = require('gulp-print');


// Destructuring, old school.
const ui = require('../../app/utils/ui');
const pathTrimStart = ui.pathTrimStart;
const findComponent = ui.findComponent;
const getStateFromFlavour = ui.getStateFromFlavour;
const getTokens = ui.getTokens;

const INDEX = 'index';
const ENCODING = 'utf-8';


const rootPage = () => {
  return `${INDEX}.html`;
}

const renameDirectory = (filepath) => {
  if (filepath.basename !== INDEX) {
    filepath.dirname = Path.join(filepath.dirname, filepath.basename);
    filepath.basename = INDEX;
  }
}

const sitePagesTask = (gulp) => {
  const dir = config.get('paths:site:pages');
  const env = templates.configure();
  const path = Path.join(dir, '**/*');

  const render = transform((filename) => {
    return map((chunk, next) => {
      let str = chunk.toString();
      let tokens = getTokens();

      let html = env.renderString(str, {
        navigation: navigation.nav,
        config: config.get(),
        tokens: tokens,
        colours: _.get(_.find(tokens, {name: 'aliases'}), 'items', []),
      });

      return next(null, html);
    });
  });

  return gulp.src([path])
    .pipe(print())
    .pipe(render)
    .pipe(rename(renameDirectory))
    .pipe(gulp.dest(config.get('paths:staticSite:root')))
}


const siteStaticTask = (gulp) => {
  return gulp.src(Path.join(config.get('paths:site:static'), '**'))
    .pipe(print())
    .pipe(gulp.dest(config.get('paths:staticSite:static')))
}



const renderComponentFlavour = (componentData, env, nav, flavour) => {
  if (flavour.states) {
    flavour.states.forEach((variant) => {
      let state = getStateFromFlavour(componentData, flavour.id, variant.id);
      let stateDir = Path.join(rawDir, flavour.id, variant.id);
      renderState(env, stateDir, nav, componentData, state);
    });
  }

  if (flavour.state) {
    let stateDir = Path.join(rawDir, flavour.id);
    renderState(env, stateDir, nav, componentData, flavour.state);
  }
}


const renderComponentDoc = (component, env, nav) => {
  let dirPath = Path.join(SITE_DIR, component.path);
  let htmlPath = Path.join(dirPath, rootPage());
  let rawDir = Path.join(SITE_DIR, 'raw', component.id);
  let rawPath = Path.join(rawDir, rootPage());

  let componentData = findComponent(component.id);
  let componentPath = Path.join(component.path, component.id + '.html');
  componentData.template = pathTrimStart(componentPath);

  let html = env.render(config.get('templates:component'), {
    navigation: nav,
    component: componentData,
    config: config.get(),
    tokens: getTokens()
  });

  utils.mkdirpSync(rawDir);
  utils.mkdirpSync(dirPath);


  fs.writeFileSync(htmlPath, html, ENCODING);

  if (componentData.flavours) {
    componentData.flavours.forEach((flavour) => {
      return renderComponentFlavour(componentData, env, nav, flavour);
    });
  }
}

// Renders the documentation for each component
const renderDocs = (SITE_DIR, name) => {
  let env = templates.configure();
  let nav = navigation.nav;
  let components = _.find(nav.children, {id: name}) || {children: []};

  components.children.forEach((component) => {
    return renderComponentDoc(component, env, nav);
  });
}


// Renders the `raw` view of each component's state
const renderState = (env, stateDir, nav, componentData, state) => {
  let statePath = Path.join(stateDir, indexHTML());
  let raw = env.render(config.get('templates:raw'), {
    navigation: nav,
    component: componentData,
    state: state,
    config: config.get(),
    tokens: getTokens()
  });

  utils.mkdirpSync(stateDir);
  fs.writeFileSync(statePath, raw, ENCODING);
  gutil.log(statePath);
}


const siteDocsTask = (gulp, done) => {
  renderDocs(config.get('paths:staticSite:root'), 'components');
  done(null);
  process.exit(0);
}


module.exports = (gulp) => {
  gulp.task(prefix('site:pages'), () => sitePagesTask(gulp));
  gulp.task(prefix('site:static'), () => siteStaticTask(gulp));
  gulp.task(prefix('site'), [
    prefix('site:pages'),
    prefix('site:static')
  ], (done) => { return siteDocsTask(gulp, done)});
}
