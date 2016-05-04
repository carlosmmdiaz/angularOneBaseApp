'use strict';

var gulp = require('gulp'),
    os = require('os'),
    open = require('gulp-open'),
    browser = os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? 'google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

// Default usage: 
// Open one file with default application 
gulp.task('open', function(){
    doOpen();
});

function doOpen(){
    var options = {
        url: 'http://localhost:8080/',
        app: browser
        },
        dirHtml='./app/'+(type==='dist'?'dist':'/devTmp');
    gulp.src(dirHtml+'/es/index.html')
        .pipe(open('',options));
}