"use strict";

const ui = require('../../app/utils/ui');

const schemaTask = (done) => {
  ui.getTokens();
  done();
}


module.exports = (gulp) => {
  gulp.task('schema', schemaTask)
}
