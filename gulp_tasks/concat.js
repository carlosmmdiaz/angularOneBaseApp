'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	js = require('./config').js;

gulp.task('concat', function() {
  return gulp.src(js.srcToWacth)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(js.destJs));
});