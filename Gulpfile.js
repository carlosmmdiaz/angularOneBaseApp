'use strict';

var gulp        = require('gulp'),
    runSequence = require('run-sequence'),
    requireDir  = require('require-dir');

requireDir('./gulp_tasks');

// This task start the app for development:
gulp.task('start', ['clean'], function() {
	runSequence('clean', 'bower', 'concat', 'jade', 'sass', 'watch');
});

//gulp.task('default', ['start']);

var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: '.tmp'
        }
    });
});