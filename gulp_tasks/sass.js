'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassConfig = require('./config').sass;

gulp.task('sass',function(){
    return compileSass();
});

gulp.task('sass-compressed', function () {
 return gulp.src(sassConfig.mainSrc)
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest(sassConfig.destSass));
});

function compileSass(){
    return gulp.src(sassConfig.mainSrc)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(sassConfig.destSass));
}