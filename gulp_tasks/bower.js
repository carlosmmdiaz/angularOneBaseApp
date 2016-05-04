'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	minify = require('gulp-minify'),
	bower = require('./config').bower;

gulp.task('concatBower', function() {
 	return gulp.src(bower.src)
    .pipe(concat('bower.js'))
    .pipe(gulp.dest(bower.destBower));
});
 
gulp.task('bower', ['concatBower'], function() {
  	return gulp.src(bower.destBower + '/' +bower.js)
    .pipe(minify())
    .pipe(gulp.dest(bower.destBower));
});