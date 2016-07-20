var gulp = require('gulp');

require('./scripts/tasks/tokens');
require('./scripts/tasks/component');
require('./scripts/tasks/ui');
require('./scripts/tasks/site');
require('./scripts/tasks/watch');
require('./scripts/tasks/server');


gulp.task('default', ['tokens', 'site'], function() {

});
