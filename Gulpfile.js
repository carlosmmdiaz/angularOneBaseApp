'use strict';

var gulp        = require('gulp'),
    //runSequence = require('run-sequence'),
    requireDir  = require('require-dir');

requireDir('./gulp_tasks');


/*gulp.task('server', function(){
    runSequence('serv', 'open');
});*/

//gulp.task('deploy', ['ftp']);

//gulp.task('default', ['clean','sass']);
//gulp.task('default', ['clean', 'jade', 'watch']);
gulp.task('default', ['cleanJade', 'sass', 'watch']);
//
//gulp.task('default', ['start']);