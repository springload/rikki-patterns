'use strict';

const gulp = require('gulp');
const prefix = require('./scripts/tasks/prefix');

require('./scripts/tasks/')(gulp);



gulp.task('default', [prefix('tokens'), prefix('site')], function() {

});
