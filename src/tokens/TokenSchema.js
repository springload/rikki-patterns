const _ = require('lodash');
const fs = require('fs');
const glob = require('glob');
const Path = require('path');

const { mapToCSS } = require('./tokenUtils');

function makeContext(arr) {
    const obj = {};
    arr.forEach((item) => {
        _.forOwn(item, (val, key) => {
            obj[key] = val;
        });
    });
    return obj;
}

function TokenSchema(props) {
    const schema = {
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
            let category;
            let items;

            // Most tokens.
            if (tokens.data.global) {
                category = tokens.data.global.category;
                items = _.map(tokens.data.props, (value, key) => Object.assign({ name: key }, value));
            // Colors / aliases.
            } else {
                category = 'color';
                items = _.map(tokens.data, (value, key) => ({ name: key, value: value }));
            }

            return Object.assign({}, tokens, {
                items: items.map(mapToCSS.bind(null, category)),
            });
        },
    };

    return _.assign(schema, props);
}

module.exports = TokenSchema;
