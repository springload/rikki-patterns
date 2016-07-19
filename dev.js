var app = require('./index');
var PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log('Running on', PORT);
});
