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


const watchTask = (gulp) => {
  gulp.watch(path.join('./app/scss', '**', '*.scss'), [prefix('scss:site')]);
  // gulp.watch(path.join('./ui/scss', '**', '*.scss'), [prefix('scss')]);
  // gulp.watch(path.join('./ui/tokens', '**', '*.json'), [prefix('tokens')]);
}

module.exports = (gulp) => {
    gulp.task(prefix('watch'), () => watchTask(gulp));
}
