var gulp = require('gulp');
var gutil = require('gulp-util');
var transform = require('vinyl-transform')
var map = require('map-stream');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');


gulp.task('watch', function() {
    gulp.watch(path.join('./app/scss', '**', '*.scss'), ['scss:site']);
    gulp.watch(path.join('./ui/scss', '**', '*.scss'), ['scss']);
    gulp.watch(path.join('./ui/tokens', '**', '*.json'), ['tokens']);
});
