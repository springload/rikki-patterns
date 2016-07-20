var app = require('./index');
var config = require('./app/config');
var PORT = config.get('PORT');


app.listen(PORT, function() {
    // console.log('Running on', PORT);
});
