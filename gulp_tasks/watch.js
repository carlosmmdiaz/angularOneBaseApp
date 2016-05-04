'use strict';

var gulp = require('gulp'),
    srcJs = require('./config').js.srcToWacth,
    srcSass = require('./config').sass.srcToWacth,
    srcJade = require('./config').jade.srcToWacth;

gulp.task('watch', function(callbacks){
    gulp.watch(srcJs, ['concat'])
        .on('change', logWatch);
    gulp.watch(srcSass, ['sass'])
        .on('change', logWatch);
    gulp.watch(srcJade, ['jade'])
        .on('change', logWatch);

    function logWatch(event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
    return callbacks;
});