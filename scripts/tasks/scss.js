var gulp = require('gulp');
var path = require('path');

var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var gutil = require('gulp-util');
var plz = require('gulp-pleeease');
var parker = require('gulp-parker');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
// var critical = require('critical');
var rename = require('gulp-rename');


var prod = false;

var PlzOptions = {
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


gulp.task('scss', function() {
    return gulp.src(path.join( './ui/scss', "*.scss" ), {base: './ui/scss'})
        .pipe(prod ? gutil.noop() : sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .on('error', function handleError(err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(plz( PlzOptions ))
        .pipe(prod ? gutil.noop() : sourcemaps.write())
        .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
        .pipe(gulp.dest( './ui/css' ))
        .pipe(rename('ui.css'))
        .pipe(gulp.dest( './app/static/css' ))
});


gulp.task('scss:site', function() {
    return gulp.src(path.join( './app/scss', "*.scss" ), {base: './app/scss'})
        .pipe(prod ? gutil.noop() : sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .on('error', function handleError(err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(plz( PlzOptions ))
        .pipe(prod ? gutil.noop() : sourcemaps.write())
        .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
        .pipe(gulp.dest( './app/static/css' ))
});

