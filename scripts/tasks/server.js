'use strict';

const config = require('../../app/config');
const browserSync = require('browser-sync').create(config.get('app:title'));
const nodemon = require('gulp-nodemon');
const Path = require('path');
const prefix = require('./prefix');
const gutil = require('gulp-util');

const NODEMON_BOOT_WAIT_TIME = config.get('NODEMON_BOOT_WAIT_TIME');


const nodemonTask = (cb) => {
  let script = Path.join(__dirname, '..', '..', 'dev.js')
  let called = false;

  return nodemon({
    script: script,
    watch: [script],
    ignore: [
      Path.join(config.get('root', 'gulpfile.js'),
      Path.join(config.get('root', 'node_modules'),
      'gulpfile.js',
      'node_modules',
    ],
    env: { 'NODE_ENV': config.get('NODE_ENV') }
  })
  .on('start', () => {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!called) {
      setTimeout(() => {
        called = true;
        cb();
      }, NODEMON_BOOT_WAIT_TIME);
    }
  })
  .on('crash',()  => {
    gutil.log('nodemon.crash');
  })
  .on('restart', () => {
    setTimeout(() => {
      browserSync.reload({ stream: false });
    }, config.get('BROWSERSYNC_RELOAD_INTERVAL'));
  })
  .once('quit', () => {
    // handle ctrl+c without crying
    process.exit();
  });
}

const browserSyncTask = () => {
  browserSync.init({
    proxy: `http://localhost:${config.get('PORT')}`,
    files: [
      Path.join(config.get('root'), "app/static/**/*.*"),
      "ui/**/*.*",
    ],
    browser: ['google chrome'],
    port: config.get('proxy'),
    notify: true,
    open: 'local',
  }, () => {
    gutil.log('Browserify booted');
  });
}


module.exports = (gulp) => {
  gulp.task(prefix('dev'), [prefix('watch'), prefix('browser-sync')], () => {});
  gulp.task(prefix('server'), [prefix('browser-sync')], () => {});
  gulp.task(prefix('browser-sync'), [prefix('nodemon')], browserSyncTask);
  gulp.task(prefix('nodemon'), nodemonTask);
}
