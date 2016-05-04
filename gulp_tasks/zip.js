'use strict';

var gulp   = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip', function(){
    var dir='dist';
    return gulp.src([dir+'/**/*'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest(dir+'/..'));
});