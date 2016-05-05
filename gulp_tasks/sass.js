'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassConfig = require('./config').sass;

gulp.task('sass',function(){
    return compileSass();
});

function compileSass(){
    return gulp.src(sassConfig.mainSrc)
        .pipe(sass())
        .on('error', function(error) {
            console.log('Error SASS: ' + error);
            this.emit('end');
        })
        .pipe(gulp.dest(sassConfig.destSass));
}