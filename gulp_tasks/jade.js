'use strict';

var gulp   = require('gulp'),
    jade = require('gulp-jade'),
    jadeConfig = require('./config').jade;

gulp.task('cleanJade', ['clean'], function(){
    compileJade(jadeConfig.src, jadeConfig.destJade);
});

gulp.task('jade', function() {

    compileJade(jadeConfig.src, jadeConfig.destJade);
    console.log('fin');
});

function compileJade(src, dest){
    gulp.src(src)
        .pipe(jade({
            locals: {}
        }))
        .on('error', function(error) {
            console.log('Error JADE: ' + error);
            this.emit('end');
        })
        .pipe(gulp.dest(dest));
}