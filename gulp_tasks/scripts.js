'use strict';

var gulp = require('gulp');

gulp.task('scripts', function() {
    return gulp.src(['app/scripts/**/*.js'])
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        .pipe(gulp.dest('dist/scripts'));
});