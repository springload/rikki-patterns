'use strict';

const _ = require('lodash');
const gutil = require('gulp-util');
const Path = require('path');
const fs = require('fs');
const ase = require('ase-utils');
const rename = require('gulp-rename');
const Color = require("color");
const transform = require('vinyl-transform')
const map = require('map-stream');
const concat = require('gulp-concat');

const utils = require('../../app/utils');
const config = require('../../app/config');
const prefix = require('./prefix');

const OUTPATH_TOKENS = config.get('paths:ui:swatches');
const PATH_TOKENS = config.get('paths:ui:tokens');
const PATH_ALIASES = config.get('paths:ui:aliases');
const PATH_SCSS = config.get('paths:ui:scss');
const TOKENS_SCSS = config.get('paths:ui:tokensScss');


const logError = (err) => {
    gutil.log(err.message);
};


const makeContext = (arr) => {
    var obj = {};
    arr.forEach(function(item) {
        _.forOwn(item, function(val, key) {
            obj[key] = val;
        });
    });
    return obj;
}


const formatAliases = (tokens, filename) => {
  var doc = [];
  var prefix = null;

  if (filename.match(/aliases/)) {
    prefix = 'color';
  }

  _.forOwn(tokens, (val, key) => {
    doc.push(utils.makeCSSVariable(prefix, key, val));
  });

  return doc.join('\n');
}


const formatTokens = (tokens, filename) => {
  var doc = [];
  var imports;
  var context;
  var category = _.kebabCase(tokens.global.category);

  if (tokens.imports) {
    imports = tokens.imports.map((file) => {
      var path = Path.join(Path.dirname(filename), file);
      return JSON.parse(fs.readFileSync(path));
    });
    context = makeContext(imports);
  }

  _.forOwn(tokens.props, (val, key) => {
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


const tokenCssTask = (gulp) => {
  let cssify = transform((filename) => {
    return map((chunk, next) => {
      let tokens = JSON.parse(chunk.toString());

      if (tokens.global) {
        return next(null, formatTokens(tokens, filename));
      } else {
        return next(null, formatAliases(tokens, filename));
      }
    })
  });

  let template = transform((filename) => {
    return map((chunk, next) => {
      let ctx = {
        data: chunk.toString(),
        time: new Date().toString(),
        file: chunk
      };

      return next(null, gutil.template(config.get('tokens:templateString'), ctx));
    })
  });

  gulp.src([PATH_ALIASES, Path.join(PATH_TOKENS, '*.json')])
    .pipe(cssify)
    .pipe(concat(TOKENS_SCSS))
    .pipe(template)
    .pipe(gulp.dest(PATH_SCSS))
    .on('error', logError);
}



const tokensSketchTask = (gulp) => {
  const getColors = (data) => {
    let arr = [];

    for (let key in data) {
      let val = data[key];
      let color = Color(val);
      arr.push(color.rgbString());
    }

    return arr;
  }

  const sketchify = transform((filename) => {
    return map((chunk, next) => {
      let data = JSON.parse(chunk.toString());
      let formatted = {
        'compatibleVersion': config.get('swatches:sketchCompatibleVersion'),
        'pluginVersion': config.get('swatches:sketchPluginVersion'),
        'colors': getColors(data)
      }
      return next(null, JSON.stringify(formatted, null, 4));
    });
  });

  gulp.src([PATH_ALIASES])
    .pipe(sketchify)
    .pipe(rename(config.get('swatches:sketch')))
    .pipe(gulp.dest(OUTPATH_TOKENS))
    .on('error', logError);
}



const formatAdobeFloatColour = (val) => {
  if (val.match(/transparent/)) {
    return [0, 0, 0];
  }

  let color = Color(val);
  let arr = color.rgbArray();

  return [
    arr[0]/255,
    arr[1]/255,
    arr[2]/255
  ];
}


const generateAdobeColours = (data) => {
  let arr = [];

  for (let key in data) {
    let val = data[key];
    let colour = formatAdobeFloatColour(val);

    arr.push({
      "name": _.startCase(_.lowerCase(key)),
      "model": "RGB",
      "color": colour,
      "type": "global"
    });
  }

  return arr;
}


const tokensAdobeTask = (gulp) => {
  const VERSION_NUMBER = confif.get('swatches:adobeVersionNumber');

  const swatchify = transform((filename) => {
    return map((chunk, next) => {
      let data = JSON.parse(chunk);
      let input = {
        "version": VERSION_NUMBER,
        "groups": [],
        "colors": generateAdobeColours(data)
      };
      return next(null, ase.encode(input))
    });
  });

  gulp.src([PATH_ALIASES])
    .pipe(swatchify)
    .pipe(rename(config.get('swatches:adobe')))
    .pipe(gulp.dest(OUTPATH_TOKENS))
    .on('error', logError);
}

module.exports = (gulp) => {
  gulp.task(prefix('tokens:css'), () => {tokenCssTask(gulp)});
  gulp.task(prefix('tokens:sketch'), () => {tokensSketchTask(gulp)});
  gulp.task(prefix('tokens:adobe'), () => {tokensAdobeTask(gulp)});
  gulp.task(prefix('tokens'), [
    prefix('tokens:sketch'),
    prefix('tokens:adobe'),
    prefix('tokens:css')
  ], () => {});
}
