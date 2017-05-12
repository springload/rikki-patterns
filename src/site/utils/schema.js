const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const yamlFront = require('yaml-front-matter');

const pathTrimStart = str => str.replace(/\//, '');

function Schema(props) {
    return _.assign({
        generate() {
            return glob.sync(path.resolve(this.path, '*/README.md'))
        .map(this.getConfig, this)
        .map(function (config) {
            config = _.defaults(config, {
                components: [],
            });
            return _.merge(config, {
                components: this.getComponents(config),
            });
        }, this);
        },

        getConfig(configPath) {
            const id = path.basename(path.dirname(configPath));
            const title = _.startCase(_.lowerCase(id));
            const config = yamlFront.loadFront(configPath, 'readme');
            const localPath = path.dirname(configPath).replace(this.path, '');

            return _.merge({}, {
                id,
                title,
                path: pathTrimStart(localPath),
            }, config);
        },

        getComponents: function getComponents(categoryConfig) {
            return categoryConfig.components
        .map(function (name) {
            return path.resolve(
            this.path, categoryConfig.path, name, 'README.md'
          );
        }, this)
        .map(this.getConfig, this)
        .map(function (config) {
            config = _.defaults(config, {
                uid: `${categoryConfig.id}-${config.id}`,
                flavours: [],
                classBase: config.id,
            });
            return _.merge(config, {
                flavours: this.getFlavours(config),
                schema: this.getSchema(config),
            });
        }, this);
        },
        getFlavours(componentConfig) {
            return componentConfig.flavours.map((config) => {
                const id = _.kebabCase(config.title);
                config = _.defaults(config, {
                    id: id,
                    uid: `${componentConfig.id}-${id}`,
                    classBase: componentConfig.classBase,
                    states: [],
                });

                config.states = config.states.map((state) => {
                    state.id = _.kebabCase(state.title);
                    return state;
                });

                return config;
            });
        },

        getSchema(componentConfig) {
            return Object.keys(componentConfig.schema).reduce((schema, key) => {
                let example = null;
                componentConfig.flavours.some((flav) => {
                    const state = flav.states.find(st => st.data && typeof st.data[key] !== 'undefined');
                    if (state) {
                        example = state.data[key];
                    }
                    return state;
                });

                // eslint-disable-next-line no-param-reassign
                schema[key] = Object.assign({}, componentConfig.schema[key], {
                    example: example,
                });

                return schema;
            }, {});
        },
    }, props);
}

module.exports = {
    Schema: Schema,
    pathTrimStart: pathTrimStart,
};
