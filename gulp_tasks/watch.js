'use strict';

var gulp = require('gulp');

require('./config.js');

var srcSass = require('./config').sass.srcToWacth;
var srcJade = require('./config').jade.srcToWacth;

gulp.task('watch', function(callbacks){
    
    //gulp.watch(scripts, ['compress'])
    //    .on('change', logWatch);
    gulp.watch(srcSass, ['sass'])
        .on('change', logWatch);
    gulp.watch(srcJade, ['jade'])
        .on('change', logWatch);

    function logWatch(event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
    return callbacks;
});