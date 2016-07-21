var gulp = require('gulp');

require('./scripts/tasks/')(gulp);

gulp.task('default', ['tokens', 'site'], function() {

});
