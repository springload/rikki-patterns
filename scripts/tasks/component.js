"use strict";

const _ = require('lodash');
const gutil = require('gulp-util');
const Path = require('path');
const nunjucks = require('nunjucks');
const transform = require('vinyl-transform')
const map = require('map-stream');
const rename = require('gulp-rename');
const yaml = require('js-yaml');
const fs = require('fs');
const del = require('del');

const prefix = require('./prefix');


const config = require('../../app/config');
const utils = require('../../app/utils');

const makeName = utils.makeName;
const basePath = config.get('paths:components');


const addToComponentsManifest = (name) => {
    let yamlFile = Path.join(basePath, 'config.yaml');
    let dumpOpts = {};
    let data = yaml.safeLoad(fs.readFileSync(yamlFile).toString()) || {};

    data.components = _.get(data, 'components', []);

    if (data.components.indexOf(name) < 0) {
        data.components.push(name);
    }

    fs.writeFileSync(yamlFile, yaml.safeDump(data, dumpOpts));
}

const removeFromManifest = (name) => {
    let yamlFile = Path.join(basePath, 'config.yaml');
    let dumpOpts = {};
    let data = yaml.safeLoad(fs.readFileSync(yamlFile).toString());

    let index = data.components.indexOf(name);
    if (index > -1) {
        data.components.splice(index, 1);
    }

    fs.writeFileSync(yamlFile, yaml.safeDump(data, dumpOpts));
}


const removeComponentTask = () => {
  let argv = require('yargs').argv;
  let name = argv.name;
  let component = makeName(name, basePath);
  let compPath = Path.join(basePath, component.paramName);

  removeFromManifest(component.paramName);

  gutil.log('[Deleting]', Path.join(__dirname, '..', '..', compPath));

  return del([compPath]);
}


const addComponentTask = (gulp) => {
    let argv = require('yargs').argv;
    let name = argv.name;
    let component = makeName(name, basePath);
    let compPath = Path.join(basePath, component.paramName);

    gutil.log('[Writing]', Path.join(__dirname, '..', '..', compPath));

    let template = transform((filename) => {
      return map((chunk, next) => {
        let str = chunk.toString();
        let result = nunjucks.renderString(str, { data: component });
        return next(null, result);
      })
    });

    const renameTemplate = (filepath) => {
      if (filepath.extname === '.html') {
        filepath.basename = component.paramName;
      }
    }

    // Automagically add to the components manifest.
    addToComponentsManifest(component.paramName);

    gulp.src(config.get('paths:generator:template'))
      .pipe(template)
      .pipe(rename(renameTemplate))
      .pipe(gulp.dest(compPath));
}


module.exports = (gulp) => {
  gulp.task(prefix('uncomponent'), () => {removeComponentTask(gulp)});
  gulp.task(prefix('component'), () => {addComponentTask(gulp)});
}
