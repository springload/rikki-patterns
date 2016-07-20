var Path = require('path');
var _ = require('lodash');
var schema = require('./schema');

var UI_PATH = Path.join(__dirname, '..', 'ui');
var Schema = schema.default;
var _cachedSchema = null;


function getUI(category) {
    var scheme = Schema({ path: UI_PATH }).generate();
    _cachedSchema = scheme;

    if (scheme.length) {
      return _.find(scheme, {'id': category }).components;
    }

    return [];
}


module.exports = {
  getUI: getUI,
}
