"use strict";

const path = require('path');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const gutil = require('gulp-util');
const plz = require('gulp-pleeease');
const parker = require('gulp-parker');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const config = require('../../app/config');

const prefix = require('./prefix');

const prod = (process.env.NODE_ENV === 'production');

const PlzOptions = {
    minifier: prod,
    mqpacker: false,
    filters: false,
    rem: true,
    pseudoElements: true,
    opacity: true,
    autoprefixer: {
        browsers: ['ie 8', 'ie 9', '> 1%']
    }
};


const patternLibraryCSSTask = (gulp) => {
  const destPath = path.join(config.get('root'), 'app', 'static', 'css');
  const scssPath = path.join(config.get('root'), 'app', 'scss');

  return gulp.src(path.join(scssPath, '*.scss' ), {base: scssPath})
    .pipe(prod ? gutil.noop() : sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .on('error', (err) => {
      gutil.log(err.message);
      this.emit('end');
    })
    .pipe(plz( PlzOptions ))
    .pipe(prod ? gutil.noop() : sourcemaps.write())
    .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
    .pipe(gulp.dest(destPath))
}


const projectSpecificCSSTask = (gulp) => {
  return gulp.src(path.join( './ui/scss', '*.scss' ), {base: './ui/scss'})
    .pipe(prod ? gutil.noop() : sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .on('error', (err) => {
      gutil.log(err.message);
      this.emit('end');
    })
    .pipe(plz( PlzOptions ))
    .pipe(prod ? gutil.noop() : sourcemaps.write())
    .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
    .pipe(gulp.dest( './ui/css' ))
    .pipe(rename('ui.css'))
    .pipe(gulp.dest( './site/static/css' ))
}


module.exports = (gulp) => {
  gulp.task(prefix('scss'), () => {projectSpecificCSSTask(gulp)});
  gulp.task(prefix('scss:site'), () => {patternLibraryCSSTask(gulp)});
}
