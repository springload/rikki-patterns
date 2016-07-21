"use strict";

const gulp = require('gulp');
const gutil = require('gulp-util');
const transform = require('vinyl-transform')
const map = require('map-stream');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');


gulp.task('watch', function() {
    gulp.watch(path.join('./app/scss', '**', '*.scss'), ['scss:site']);
    gulp.watch(path.join('./ui/scss', '**', '*.scss'), ['scss']);
    gulp.watch(path.join('./ui/tokens', '**', '*.json'), ['tokens']);
});
