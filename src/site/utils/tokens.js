var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var Path = require('path');

var utils = require('./index');


function makeContext(arr) {
    var obj = {};
    arr.forEach(function (item) {
        _.forOwn(item, function (val, key) {
            obj[key] = val;
        });
    });
    return obj;
}


function mapToCSS(item) {
    item.humanName = _.startCase(_.lowerCase(item.name));
    item.cssName = utils.makeCSSName('color', item.name);
    return item;
}


function TokenSchema(props) {
    return _.assign({
        generate() {
            return glob.sync(this.path).map(function (path) {
                var extName = Path.extname(path);
                var name = Path.basename(path, extName);
                var contents = fs.readFileSync(path, 'utf-8').toString();

                return {
                    name: name,
                    path: path,
                    contents: contents,
                };
            }, this).map(this.template, this).map(this.toArray,  this);
        },
        template(tokens) {
            var context = {};
            var imports;
            var initialData = JSON.parse(tokens.contents);

            if (initialData.imports) {
                imports = initialData.imports.map(function (file) {
                    var path = Path.join(Path.dirname(tokens.path), file);
                    return JSON.parse(fs.readFileSync(path));
                });
                context = makeContext(imports);
            }

            var compiled = _.template(tokens.contents);
            var result = compiled(context);
            delete tokens['contents'];
            tokens.data = JSON.parse(result);
            return tokens;
        },
        toArray(tokens) {
            if (tokens.data.global) {
                tokens.items = _.values(tokens.data.props);
            } else {
                return this.aliases(tokens);
            }
            return tokens;
        },
        aliases(tokens) {
            var aliases = [];
            _.forOwn(tokens.data, function (value, key) {
                aliases.push({
                    name: key,
                    value: value,
                });
            });
            tokens.items = aliases.map(mapToCSS);
            return tokens;
        },
    }, props);
}


module.exports = {
    default: TokenSchema,
};
