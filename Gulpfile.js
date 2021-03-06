'use strict';

var gulp        = require('gulp'),
    runSequence = require('run-sequence'),
    requireDir  = require('require-dir'),
    browserSync = require('browser-sync').create(),
    config = require('./gulp_tasks/config');

requireDir('./gulp_tasks');

// Main task that get ready everything that we need to start developing:
gulp.task('start', ['clean'], function() {
	runSequence('clean', 'bower', 'concat', 'jade', 'sass');
});

var mocks = {
    '/mock': function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            name: 'shane'
        }));
    }
};
// Default task, just type gulp:
gulp.task('default', ['start'], function() {    
    browserSync.init(
	    config.main.reloadFiles,
	    {
	        server: config.main.dest,
            port: config.main.port,
            middleware: function (req, res, next) {
                if (mocks[req.url]) {
                    mocks[req.url](req, res);
                }
                next();
            }
	    }
    );
    gulp.watch(config.js.srcToWacth, ['concat'])
        .on('change', logWatch);
    gulp.watch(config.sass.srcToWacth, ['sass'])
        .on('change', logWatch);
    gulp.watch(config.jade.srcToWacth, ['jade'])
        .on('change', logWatch);
});

function logWatch(event) {
    console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
}