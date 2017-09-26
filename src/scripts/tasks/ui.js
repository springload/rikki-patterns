const _ = require('lodash');
const path = require('path');
const gulp = require('gulp');

const schema = require('../../site/utils/schema');
const TokenSchema = require('../../tokens/TokenSchema');

const Schema = schema.Schema;

const config = require('../../config');

function getUI(category) {
    const scheme = Schema({ path: config.paths.ui.root }).generate();
    return _.find(scheme, { id: category }).components;
}

function getSchema(category) {
    const s = Schema({ path: config.paths.ui.root }).generate();
    return _.find(s, { id: category });
}

function findComponent(id) {
    const components = getSchema('components');
    return _.find(components.components, { id: id });
}

function getStateFromFlavour(component, flavour, variant) {
    const flavourData = _.find(component.flavours, { id: flavour });
    let state;

    if (flavourData.states && Array.isArray(flavourData.states)) {
        state = _.find(flavourData.states, { id: variant });
    }

    if (flavourData.state) {
        state = flavourData.state;
    }

    return state;
}

function getTokens() {
    return TokenSchema({
        path: path.join(config.paths.ui.tokens, '*.json'),
    }).generate();
}

module.exports = {
    getUI,
    getSchema,
    getTokens,
    findComponent,
    pathTrimStart: schema.pathTrimStart,
    getStateFromFlavour,
};

gulp.task('schema', done => {
    getTokens();
    done();
});
