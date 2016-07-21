"use strict";

const gulp = require('gulp');
const gutil = require('gulp-util');
const transform = require('vinyl-transform')
const map = require('map-stream');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const prefix = require('./prefix');
const config = require('../../app/config');

const root = config.get('root');
const scssPath = path.join(root, 'app', 'scss', '**', '*.scss');

const watchTask = (gulp) => {
  gulp.watch(scssPath, [prefix('scss:site')]);
}

module.exports = (gulp) => {
    gulp.task(prefix('watch'), () => watchTask(gulp));
}
