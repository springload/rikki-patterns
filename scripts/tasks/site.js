"use strict";

const _ = require('lodash');
const gulp = require('gulp');
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
const nconf = require('../../app/config');
const prefix = require('./prefix');


// Destructuring, old school.
const ui = require('./ui');
const pathTrimStart = ui.pathTrimStart;
const findComponent = ui.findComponent;
const getStateFromFlavour = ui.getStateFromFlavour;
const getTokens = ui.getTokens;


const renameDirectory = (filepath) => {
  if (filepath.basename !== 'index') {
    filepath.dirname = Path.join(filepath.dirname, filepath.basename);
    filepath.basename = 'index';
  }
}


const sitePagesTask = (gulp) => {
  var dir = nconf.get('paths:site:pages');
  var env = templates.configure();

  var render = transform((filename) => {
      return map((chunk, next) => {
          var str = chunk.toString();
          var tokens = getTokens();

          var html = env.renderString(str, {
              navigation: navigation.nav,
              config: nconf.get(),
              tokens: tokens,
              colours: _.get(_.find(tokens, {name: 'aliases'}), 'items', []),
          });
          return next(null, html);
      });
  });

  return gulp.src([ Path.join(dir, '**/*') ])
      .pipe(render)
      .pipe(rename(renameDirectory))
      .pipe(gulp.dest(nconf.get('paths:staticSite:root')))
}


const siteStaticTask = (gulp) => {
  gulp.src(Path.join(nconf.get('paths:site:static'), '**'))
      .pipe(gulp.dest(nconf.get('paths:staticSite:static')))
}


// Renders the documentation for each component
const renderDocs = (SITE_DIR, name) => {
    var env = templates.configure();
    var nav = navigation.nav;
    var components = _.find(nav.children, {id: name}) || {children: []};

    components.children.forEach((component) => {
        var dirPath = Path.join(SITE_DIR, component.path);
        var htmlPath = Path.join(dirPath, 'index.html');
        var rawDir = Path.join(SITE_DIR, 'raw', component.id);
        var rawPath = Path.join(rawDir, 'index.html');

        var componentData = findComponent(component.id);
        componentData.template = pathTrimStart(Path.join(component.path, component.id + '.html'));

        var html = env.render('component.html', {
            navigation: nav,
            component: componentData,
            config: nconf.get(),
            tokens: getTokens()
        });

        utils.mkdirpSync(rawDir);
        utils.mkdirpSync(dirPath);

        console.log(htmlPath);
        fs.writeFileSync(htmlPath, html, 'utf-8');

        if (componentData.flavours) {
            componentData.flavours.forEach((flavour) => {
                if (flavour.states) {
                    flavour.states.forEach((variant) => {
                        var state = getStateFromFlavour(componentData, flavour.id, variant.id);
                        var stateDir = Path.join(rawDir, flavour.id, variant.id);
                        renderState(env, stateDir, nav, componentData, state);
                    });
                }

                if (flavour.state) {
                    var stateDir = Path.join(rawDir, flavour.id);
                    renderState(env, stateDir, nav, componentData, flavour.state);
                }
            });
        }
    });
}


// Renders the `raw` view of each component's state
const renderState = (env, stateDir, nav, componentData, state) => {
    let statePath = Path.join(stateDir, 'index.html');
    let raw = env.render('component-raw.html', {
        navigation: nav,
        component: componentData,
        state: state,
        config: nconf.get(),
        tokens: getTokens()
    });

    utils.mkdirpSync(stateDir);
    fs.writeFileSync(statePath, raw, 'utf-8');
    console.log(statePath);
}


const siteDocsTask = (gulp, done) => {
    renderDocs(nconf.get('paths:staticSite:root'), 'components');
    done(null);
    process.exit(0);
}


module.exports = (gulp) => {
  gulp.task(prefix('site:pages'), () => {sitePagesTask(gulp)});
  gulp.task(prefix('site:static'), () => {siteStaticTask(gulp)});
  gulp.task(prefix('site'), [
    prefix('site:pages'),
    prefix('site:static')
  ], (done) => {siteDocsTask(gulp, done)});
}
