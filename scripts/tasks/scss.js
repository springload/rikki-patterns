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


const siteCSSTask = (gulp) => {
  return gulp.src(path.join( './app/scss', "*.scss" ), {base: './app/scss'})
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
    .pipe(gulp.dest( './app/static/css' ))
}


const libraryCSSTask = (gulp) => {
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
    .pipe(gulp.dest( './app/static/css' ))
}


module.exports = (gulp) => {
  gulp.task('scss', () => {libraryCSSTask(gulp)});
  gulp.task('scss:site', () => {siteCSSTask(gulp)});
}
