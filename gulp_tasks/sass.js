'use strict';
require('./config.js');

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    sass = require('./config').sass;

gulp.task('sass',function(){
    return compileSass();
});

function compileSass(){
    return gulp.src(sass.mainSrc)
        .pipe(compass({
            css: sass.destSass,
            sass: sass.origin,
        })).on('error', function(error) {
            console.log('Error SASS: ' + error);
            this.emit('end');
        })
        .pipe(gulp.dest(sass.destSass));
}