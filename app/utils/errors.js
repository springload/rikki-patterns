import PrettyError from 'pretty-error';

const pe = new PrettyError();


export const logError = (err, req, res, next) => {
   console.log(pe.render(err));
   next(err);
}

export const default404 = (err, req, res, next) => {
    if (!err) {
        var err = new Error('Not Found');
        err.status = 404;
    }
    next(err);
}

export const handle404 = (req, res, next) => {
    if (req.status === 404) {
        res.send('Not Found');
    }
}
