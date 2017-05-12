const _ = require('lodash');
const gulp = require('gulp');
const gutil = require('gulp-util');
const Path = require('path');
const fs = require('fs');
const ase = require('ase-utils');
const rename = require('gulp-rename');
const Color = require('color');
const transform = require('vinyl-transform');
const map = require('map-stream');
const concat = require('gulp-concat');

const utils = require('../../site/utils');
const config = require('../../config');

const OUTPATH_TOKENS = config.paths.ui.swatches;
const PATH_TOKENS = config.paths.ui.tokens;
const PATH_ALIASES = config.paths.ui.aliases;
const PATH_SCSS = config.paths.ui.scss;
const TOKENS_SCSS = config.paths.ui.tokensScss;

function makeContext(arr) {
    const obj = {};
    arr.forEach((item) => {
        _.forOwn(item, (val, key) => {
            obj[key] = val;
        });
    });
    return obj;
}

gulp.task('tokens:css', () => {
    function formatAliases(tokens, filename) {
        const doc = [];
        let prefix = null;

        if (filename.match(/aliases/)) {
            prefix = 'color';
        }

        _.forOwn(tokens, (val, key) => {
            doc.push(utils.makeCSSVariable(prefix, key, val));
        });

        return doc.join('\n');
    }

    function formatTokens(tokens, filename) {
        const doc = [];
        let imports;
        let context;
        const category = _.kebabCase(tokens.global.category);

        if (tokens.imports) {
            imports = tokens.imports.map((file) => {
                const path = Path.join(Path.dirname(filename), file);
                return JSON.parse(fs.readFileSync(path));
            });
            context = makeContext(imports);
        }

        _.forOwn(tokens.props, (val, key) => {
            let textValue = val;

            if (val.hasOwnProperty('value')) {
                textValue = val.value;
            }

            const compiled = _.template(textValue);
            textValue = compiled(context);

            // Deal with string types
            if (tokens.global.format === 'string') {
                textValue = utils.quote(textValue);
            }

            doc.push(utils.makeCSSVariable(category, key, textValue));
        });

        return doc.join('\n');
    }

    const cssify = transform((filename) => {
        return map((chunk, next) => {
            const tokens = JSON.parse(chunk.toString());

            if (tokens.global) {
                return next(null, formatTokens(tokens, filename));
            }
            return next(null, formatAliases(tokens, filename));
        });
    });

    const template = transform((filename) => {
        return map((chunk, next) => {
            const template = '// Design System Tokens \n// Generated at <%= time %> \n\n<%= data %>';
            const ctx = {
                data: chunk.toString(),
                time: new Date().toString(),
                file: chunk,
            };

            return next(null, gutil.template(template, ctx));
        });
    });

    gulp
        .src([PATH_ALIASES, Path.join(PATH_TOKENS, '*.json')])
        .pipe(cssify)
        .pipe(concat(TOKENS_SCSS))
        .pipe(template)
        .pipe(gulp.dest(PATH_SCSS))
        .on('error', (err) => {
            gutil.log(err.message);
        });
});

gulp.task('tokens:sketch', () => {
    function getColors(data) {
        const arr = [];

        for (const key in data) {
            const val = data[key];
            const color = Color(val);
            arr.push(color.rgbString());
        }

        return arr;
    }

    const sketchify = transform((filename) => {
        return map((chunk, next) => {
            const data = JSON.parse(chunk.toString());
            const formatted = {
                compatibleVersion: '1.0',
                pluginVersion: '1.1',
                colors: getColors(data),
            };
            return next(null, JSON.stringify(formatted, null, 4));
        });
    });

    gulp
        .src([PATH_ALIASES])
        .pipe(sketchify)
        .pipe(rename(config.swatches.sketch))
        .pipe(gulp.dest(OUTPATH_TOKENS))
        .on('error', (err) => {
            gutil.log(err.message);
        });
});

gulp.task('tokens:adobe', () => {
    const VERSION_NUMBER = '1.0.0';

    function formatAdobeFloatColour(val) {
        if (val.match(/transparent/)) {
            return [0, 0, 0];
        }

        const color = Color(val);
        const arr = color.rgbArray();

        return [arr[0] / 255, arr[1] / 255, arr[2] / 255];
    }

    function generateColours(data) {
        const arr = [];

        for (const key in data) {
            const val = data[key];
            const colour = formatAdobeFloatColour(val);

            arr.push({
                name: _.startCase(_.lowerCase(key)),
                model: 'RGB',
                color: colour,
                type: 'global',
            });
        }

        return arr;
    }

    const swatchify = transform((filename) => {
        return map((chunk, next) => {
            const data = JSON.parse(chunk);
            const input = {
                version: VERSION_NUMBER,
                groups: [],
                colors: generateColours(data),
            };
            return next(null, ase.encode(input));
        });
    });

    gulp
        .src([PATH_ALIASES])
        .pipe(swatchify)
        .pipe(rename(config.swatches.adobe))
        .pipe(gulp.dest(OUTPATH_TOKENS))
        .on('error', (err) => {
            gutil.log(err.message);
        });
});

gulp.task('tokens', ['tokens:sketch', 'tokens:adobe', 'tokens:css']);
