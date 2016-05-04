'use strict';

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

// gulp.task('sass', function () {
// gulp.src('src/sass/index.sass')
//    .pipe(sass({indentedSyntax: true}))
//    .pipe(gulp.dest('build/css'))
//    });