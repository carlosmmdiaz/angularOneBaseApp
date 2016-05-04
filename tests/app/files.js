'use strict';
module.exports =  files;

function files(envDef){
    var env = envDef || '../../app/';
    var initFiles=[
        env + 'bower_components/angular/angular.js'
    ];
    return initFiles;
}
