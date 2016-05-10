'use strict';
module.exports = {
    main: {
        dest: '.tmp',
        reloadFiles: [
            '.tmp/*.html',
            '.tmp/**/*.html',
            '.tmp/css/*.css',
            '.tmp/js/*.js'
        ],
        port: '3000'
    },
    sass: {
        mainSrc: 'assets/scss/main.scss',
        origin: 'assets/scss',
        srcToWacth: [
            'assets/scss/*.scss',
            'assets/scss/**/*.scss'
        ],
        destSass: '.tmp/css',
    },
    jade: {
        src:  [
            'app/index.jade',
            'app/components/**/*.jade',
            'app/shared/directives/**/*.jade'
        ],
        srcToWacth: [
            'app/index.jade',
            'app/jade/*.jade',
            'app/components/**/*.jade',
            'app/shared/directives/**/*.jade'
        ],
        destJade: '.tmp/'
    },
    js: {
        srcToWacth:  [
            'app/app.module.js',
            'app/core/router/router.module.js',
            'app/core/router/routerhelper.js',
            'app/core/core.module.js',
            'app/components/xxx/xxx.module.js',
            'app/components/xxx/xxx.route.js',
            'app/components/xxx/xxx.controller.js',
            //'app/shared/directives/**/*.js',
            //'app/shared/**/*.js'
        ],
        destJs: '.tmp/js'
    },
    bower: {
        src: [
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/angular-route/angular-route.min.js',
            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
        ],
        destBower: '.tmp/js'
    }
};