'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var nconf = require('../../app/config');
var Path = require('path');


gulp.task('server', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init({
		proxy: "http://localhost:" + nconf.get('PORT'),
    files: [
      "app/static/**/*.*",
      "ui/**/*.*",
    ],
    browser: ['google chrome'],
    port: nconf.get('proxy'),
    notify: true,
    open: 'local'
	});
});

gulp.task('nodemon', function (cb) {
  var script = Path.join(__dirname, '..', '..', 'dev.js')
	var called = false;

	return nodemon({
		script: script,
    watch: [script],
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ],
    env: { 'NODE_ENV': 'development' }
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!called) {
			cb();
			called = true;
		}
	})
  .on('crash', function() {
		console.log('nodemon.crash');
  })
  .on('restart', function () {
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 1000);
  })
  .once('quit', function () {
		// handle ctrl+c without a big weep
		process.exit();
	});
});
