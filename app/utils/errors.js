const PrettyError = require('pretty-error');
const pe = new PrettyError();


exports.logError = (err, req, res, next) => {
   console.log(pe.render(err));
   next(err);
}

exports.default404 = (err, req, res, next) => {
    if (!err) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }

    res.status(500).send(err);
}

exports.handle404 = (req, res, next) => {
    res.status(404).send('Not Found');
}
