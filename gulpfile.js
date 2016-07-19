var gulp = require('gulp');

require('./scripts/tasks/tokens');
require('./scripts/tasks/component');
require('./scripts/tasks/ui');
require('./scripts/tasks/site');
require('./scripts/tasks/scss');
require('./scripts/tasks/watch');


gulp.task('default', ['tokens', 'site'], function() {

});
