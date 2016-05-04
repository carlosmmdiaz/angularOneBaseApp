



exports = module.exports = servidor;

function servidor(type){
    var express = require('express'),
        app = express();

    // var dirconstants

    app.use('/btb/',express.static('./dist'));
    app.set('port', '8081');


    var serv = app.listen(app.get('port'), function() {
        console.log('\nExpress Mock server listening on port ' + serv.address().port);
    });

    return serv;
}
