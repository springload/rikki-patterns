var gulp = require('gulp');
var path = require('path');

var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var gutil = require('gulp-util');
var plz = require('gulp-pleeease');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var moduleImporter = require('sass-module-importer');

const config = require('../../config');


var prod = false;

var PlzOptions = {
    minifier: prod,
    mqpacker: false,
    filters: false,
    rem: true,
    pseudoElements: true,
    opacity: true,
    autoprefixer: {
        browsers: ['ie 8', 'ie 9', '> 1%'],
    },
};


gulp.task('scss', function () {
    return gulp.src(path.join(config.paths.ui.scss, '*.scss'), {
            base: config.paths.ui.scss,
        })
        .pipe(prod ? gutil.noop() : sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({ importer: moduleImporter() }))
        .on('error', function handleError(err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(plz(PlzOptions))
        .pipe(prod ? gutil.noop() : sourcemaps.write())
        .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
        // TODO Find out what this line was meant for.
        // .pipe(gulp.dest(config.paths.ui.css))
        .pipe(rename('ui.css'))
        .pipe(gulp.dest(config.paths.site.css));
});


gulp.task('scss:site', function () {
    return gulp.src(path.join(config.paths.site.scss, '*.scss'))
        .pipe(prod ? gutil.noop() : sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .on('error', function handleError(err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(plz(PlzOptions))
        .pipe(prod ? gutil.noop() : sourcemaps.write())
        .pipe(size({ title: prod ? 'CSS' : 'CSS (unminified)', showFiles: true, gzip: prod }))
        .pipe(gulp.dest(config.paths.site.css));
});

