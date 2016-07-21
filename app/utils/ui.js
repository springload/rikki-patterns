"use strict";

const _ = require('lodash');
const Path = require('path');
const fs = require('fs');
const gutil = require('gulp-util');
const glob = require('glob');

const schema = require('./schema');
const tokens = require('./tokens');
const Schema = schema.default;
const TokenSchema = tokens.default;

const UI_PATH = Path.join(__dirname, '..', '..', 'ui');
const COMPONENTS_PATH = Path.join(UI_PATH, 'components');

let _cachedSchema = null;


const getUI = (category) => {
    var scheme = Schema({ path: UI_PATH }).generate();
    _cachedSchema = scheme;

    if (scheme.length) {
      return _.get(_.find(scheme, {'id': category }), 'components', []);
    }

    return [];
}

const getSchema = (category) => {
    var schema = Schema({ path: UI_PATH }).generate();
    return _.find(schema, {'id': category});
}


const findComponent = (id) => {
    var components = getSchema('components');
    return _.find(components.components, {'id': id});
}


const getStateFromFlavour = (component, flavour, variant) => {
    var flavourData = _.find(component.flavours, {'id': flavour});
    var state;

    if (flavourData.states && Array.isArray(flavourData.states)) {
        state = _.find(flavourData.states, {'id': variant });
    }

    if (flavourData.state) {
        state = flavourData.state;
    }

    return state;
}


const getTokens = () => {
    var tokens = TokenSchema({path: Path.join('./ui/tokens', '*.json')}).generate();
    return tokens ? tokens : {};
}


module.exports = {
    getUI: getUI,
    getSchema: getSchema,
    getTokens: getTokens,
    findComponent: findComponent,
    pathTrimStart: schema.pathTrimStart,
    createTitle: schema.createTitle,
    getStateFromFlavour: getStateFromFlavour
};
