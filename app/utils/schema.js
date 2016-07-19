var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var glob = require('glob');
var yaml = require('js-yaml');


function createTitle(str) {
    return _.startCase(_.lowerCase(str));
}

function pathTrimStart(str) {
    return str.replace(/\//, '');
}



function Schema(props) {
  return _.assign({
    generate: function () {
      return glob.sync(path.resolve(this.path, '*/config.yaml'))
        .map(this.getConfig, this)
        .map(function(config) {
          config = _.defaults(config, {
            components: []
          });
          return _.merge(config, {
            components: this.getComponents(config)
          });
        }, this);
    },

    getConfig: function (configPath) {
      var id = path.basename(path.dirname(configPath));
      var title = createTitle(id);
      var config = yaml.safeLoad(fs.readFileSync(configPath).toString());
      var localPath = path.dirname(configPath).replace(this.path, '');

      return _.merge({}, {
        id,
        title,
        path: pathTrimStart(localPath)
      }, config);
    },

    getComponents: function getComponents(categoryConfig) {
      return categoryConfig.components
        .map(function(name) {
          return path.resolve(
            this.path, categoryConfig.path, name, 'config.yaml'
          )
        }, this)
        .map(this.getConfig, this)
        .map(function(config) {
          config = _.defaults(config, {
            uid: `${categoryConfig.id}-${config.id}`,
            flavours: [],
            classBase: config.id
          });
          return _.merge(config, {
            flavours: this.getFlavours(config)
          });
        }, this);
    },
    getFlavours: function (componentConfig) {
      return componentConfig.flavours
        .map(function(name) {
          return path.resolve(
            this.path, componentConfig.path, 'flavours', name, 'config.yaml'
          )
        }, this)
        .map(this.getConfig, this)
        .map(function(config) {
          config = _.defaults(config, {
            uid: `${componentConfig.id}-${config.id}`,
            classBase: componentConfig.classBase,
            states: []
          });

          config.states = config.states.map(function(state) {
            state.id = _.kebabCase(state.title);
            return state;
          });

          return config;
        }, this);
    }
  }, props)
}



module.exports = {
  default: Schema,
  createTitle: createTitle,
  pathTrimStart: pathTrimStart
}
