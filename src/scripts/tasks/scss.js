const gulp = require('gulp');
const path = require('path');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const gutil = require('gulp-util');
const plz = require('gulp-pleeease');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
// eslint-disable-next-line
const moduleImporter = require('sass-module-importer');

const config = require('../../config');

const prod = false;

const PlzOptions = {
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

gulp.task('scss', () => {
    return (gulp
            .src(path.join(config.paths.ui.scss, '*.scss'), {
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
            .pipe(gulp.dest(config.paths.staticSite.static)));
});

gulp.task('scss:site', () => {
    return gulp
        .src(path.join(config.paths.site.scss, '*.scss'))
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
        .pipe(gulp.dest(config.paths.staticSite.static));
});
