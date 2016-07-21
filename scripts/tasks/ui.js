"use strict";

const ui = require('../../app/utils/ui');

const schemaTask = (done) => {
  ui.getTokens();
  done();
}

const prefix = require('./prefix');

module.exports = (gulp) => {
  gulp.task(prefix('schema'), schemaTask)
}
