const _ = require('lodash');
const fs = require('fs');
const glob = require('glob');
const Path = require('path');

const utils = require('./index');

function makeContext(arr) {
    const obj = {};
    arr.forEach((item) => {
        _.forOwn(item, (val, key) => {
            obj[key] = val;
        });
    });
    return obj;
}

const mapToCSS = (item) => {
    return Object.assign({}, item, {
        humanName: _.startCase(_.lowerCase(item.name)),
        cssName: utils.makeCSSName('color', item.name),
    });
};

function TokenSchema(props) {
    return _.assign(
        {
            generate() {
                return glob
                    .sync(this.path)
                    .map((path) => {
                        const extName = Path.extname(path);
                        const name = Path.basename(path, extName);
                        const contents = fs.readFileSync(path, 'utf-8').toString();

                        return {
                            name: name,
                            path: path,
                            contents: contents,
                        };
                    }, this)
                    .map(this.template, this)
                    .map(this.toArray, this);
            },
            template(tokens) {
                let context = {};
                let imports;
                const initialData = JSON.parse(tokens.contents);

                if (initialData.imports) {
                    imports = initialData.imports.map((file) => {
                        const path = Path.join(Path.dirname(tokens.path), file);
                        return JSON.parse(fs.readFileSync(path));
                    });
                    context = makeContext(imports);
                }

                const compiled = _.template(tokens.contents);
                const result = compiled(context);
                // eslint-disable-next-line no-param-reassign
                delete tokens.contents;
                // eslint-disable-next-line no-param-reassign
                tokens.data = JSON.parse(result);
                return tokens;
            },
            toArray(tokens) {
                if (tokens.data.global) {
                    // eslint-disable-next-line no-param-reassign
                    tokens.items = _.values(tokens.data.props);
                } else {
                    return this.aliases(tokens);
                }
                return tokens;
            },
            aliases(tokens) {
                const aliases = [];
                _.forOwn(tokens.data, (value, key) => {
                    aliases.push({
                        name: key,
                        value: value,
                    });
                });
                // eslint-disable-next-line no-param-reassign
                tokens.items = aliases.map(mapToCSS);
                return tokens;
            },
        },
        props,
    );
}

module.exports = {
    default: TokenSchema,
};
