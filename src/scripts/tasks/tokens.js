var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var Path = require('path');
var fs = require('fs');
var ase = require('ase-utils');
var rename = require('gulp-rename');
var Color = require('color');
var transform = require('vinyl-transform');
var map = require('map-stream');
var concat = require('gulp-concat');

var utils = require('../../site/utils');
var config = require('../../config');


var OUTPATH_TOKENS = config.paths.ui.swatches;
var PATH_TOKENS = config.paths.ui.tokens;
var PATH_ALIASES = config.paths.ui.aliases;
var PATH_SCSS = config.paths.ui.scss;
var TOKENS_SCSS = config.paths.ui.tokensScss;


function makeContext(arr) {
    var obj = {};
    arr.forEach(function (item) {
        _.forOwn(item, function (val, key) {
            obj[key] = val;
        });
    });
    return obj;
}


gulp.task('tokens:css', function () {
    function formatAliases(tokens, filename) {
        var doc = [];
        var prefix = null;

        if (filename.match(/aliases/)) {
            prefix = 'color';
        }

        _.forOwn(tokens, function (val, key) {
            doc.push(utils.makeCSSVariable(prefix, key, val));
        });

        return doc.join('\n');
    }

    function formatTokens(tokens, filename) {
        var doc = [];
        var imports;
        var context;
        var category = _.kebabCase(tokens.global.category);

        if (tokens.imports) {
            imports = tokens.imports.map(function (file) {
                var path = Path.join(Path.dirname(filename), file);
                return JSON.parse(fs.readFileSync(path));
            });
            context = makeContext(imports);
        }

        _.forOwn(tokens.props, function (val, key) {
            var textValue = val;

            if (val.hasOwnProperty('value')) {
                textValue = val.value;
            }

            var compiled = _.template(textValue);
            textValue = compiled(context);

            // Deal with string types
            if (tokens.global.format === 'string') {
                textValue = utils.quote(textValue);
            }

            doc.push(utils.makeCSSVariable(category, key, textValue));
        });

        return doc.join('\n');
    }

    var cssify = transform(function (filename) {
        return map(function (chunk, next) {
            var tokens = JSON.parse(chunk.toString());

            if (tokens.global) {
                return next(null, formatTokens(tokens, filename));
            } else {
                return next(null, formatAliases(tokens, filename));
            }
        });
    });

    var template = transform(function (filename) {
        return map(function (chunk, next) {
            var template = '// Design System Tokens \n// Generated at <%= time %> \n\n<%= data %>';
            var ctx = {
                data: chunk.toString(),
                time: new Date().toString(),
                file: chunk,
            };

            return next(null, gutil.template(template, ctx));
        });
    });

    gulp.src([PATH_ALIASES, Path.join(PATH_TOKENS, '*.json')])
        .pipe(cssify)
        .pipe(concat(TOKENS_SCSS))
        .pipe(template)
        .pipe(gulp.dest(PATH_SCSS))
        .on('error', function handleError(err) {
            gutil.log(err.message);
        });
});


gulp.task('tokens:sketch', function () {
    function getColors(data) {
        var arr = [];

        for (var key in data) {
            var val = data[key];
            var color = Color(val);
            arr.push(color.rgbString());
        }

        return arr;
    }

    var sketchify = transform(function (filename) {
        return map(function (chunk, next) {
            var data = JSON.parse(chunk.toString());
            var formatted = {
                'compatibleVersion': '1.0',
                'pluginVersion': '1.1',
                'colors': getColors(data),
            };
            return next(null, JSON.stringify(formatted, null, 4));
        });
    });

    gulp.src([PATH_ALIASES])
        .pipe(sketchify)
        .pipe(rename(config.swatches.sketch))
        .pipe(gulp.dest(OUTPATH_TOKENS))
        .on('error', function handleError(err) {
            gutil.log(err.message);
        });
});


gulp.task('tokens:adobe', function () {
    var VERSION_NUMBER = '1.0.0';

    function formatAdobeFloatColour(val) {
        if (val.match(/transparent/)) {
            return [0, 0, 0];
        }

        var color = Color(val);
        var arr = color.rgbArray();

        return [
            arr[0] / 255,
            arr[1] / 255,
            arr[2] / 255,
        ];
    }

    function generateColours(data) {
        var arr = [];

        for (var key in data) {
            var val = data[key];
            var colour = formatAdobeFloatColour(val);

            arr.push({
                'name': _.startCase(_.lowerCase(key)),
                'model': 'RGB',
                'color': colour,
                'type': 'global',
            });
        }

        return arr;
    }

    var swatchify = transform(function (filename) {
        return map(function (chunk, next) {
            var data = JSON.parse(chunk);
            var input = {
                'version': VERSION_NUMBER,
                'groups': [],
                'colors': generateColours(data),
            };
            return next(null, ase.encode(input));
        });
    });

    gulp.src([PATH_ALIASES])
        .pipe(swatchify)
        .pipe(rename(config.swatches.adobe))
        .pipe(gulp.dest(OUTPATH_TOKENS))
        .on('error', function handleError(err) {
            gutil.log(err.message);
        });
});


gulp.task('tokens', [
    'tokens:sketch',
    'tokens:adobe',
    'tokens:css',
]);
