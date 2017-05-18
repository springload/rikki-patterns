const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const views = require('./views');
const templates = require('./templates');

const app = express();

app.use('/static', express.static(path.join(process.cwd(), 'client', 'static')));
app.use('/static', express.static(path.join(process.cwd(), 'core', 'static')));
app.use('/static', express.static(path.join(__dirname, 'static')));
templates.configure(app);
app.use(bodyParser.json());

app.get([
    '/raw/:name/:flavour/:variant',
    '/raw/:name/:flavour',
    '/raw/:name',
], views.componentRawView);

app.get([
    '/components/:name',
    '/components/:name/:flavour',
    '/components/:name/:flavour/:variant',
], views.componentOverviewView);

app.get('*', views.generic);

app.use((err, req, res, next) => {
    if (err) {
        next(err);
    } else {
        const notFound = new Error('Not Found');
        notFound.status = 404;
        next(notFound);
    }
});

app.use((req, res) => {
    if (req.status === 404) {
        res.send('Not Found');
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Running on ${PORT}`);
});
