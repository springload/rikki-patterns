var _ = require('lodash');
var path = require('path');
var gulp = require('gulp');

var schema = require('../../site/utils/schema');
var tokens = require('../../site/utils/tokens');
var Schema = schema.Schema;
var TokenSchema = tokens.default;

const config = require('../../config');

function getUI(category) {
    var scheme = Schema({ path: config.paths.ui.root }).generate();
    return _.find(scheme, { 'id': category }).components;
}

function getSchema(category) {
    var schema = Schema({ path: config.paths.ui.root }).generate();
    return _.find(schema, { 'id': category });
}


function findComponent(id) {
    var components = getSchema('components');
    return _.find(components.components, { 'id': id });
}


function getStateFromFlavour(component, flavour, variant) {
    var flavourData = _.find(component.flavours, { 'id': flavour });
    var state;

    if (flavourData.states && Array.isArray(flavourData.states)) {
        state = _.find(flavourData.states, { 'id': variant });
    }

    if (flavourData.state) {
        state = flavourData.state;
    }

    return state;
}


function getTokens() {
    var tokens = TokenSchema({ path: path.join(config.paths.ui.tokens, '*.json') }).generate();
    return tokens;
}


module.exports = {
    getUI: getUI,
    getSchema: getSchema,
    getTokens: getTokens,
    findComponent: findComponent,
    pathTrimStart: schema.pathTrimStart,
    getStateFromFlavour: getStateFromFlavour,
};


gulp.task('schema', function (done) {
    getTokens();
    done();
});
