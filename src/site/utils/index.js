var _ = require('lodash');
var Path = require('path');
var fs = require('fs');


function makeCSSVariable(prefix, key, val) {
    return makeCSSName(prefix, key) + ': ' + val + ';';
}

function makeCSSName(prefix, key) {
    if (prefix) {
        return '$' + prefix + '-' + _.kebabCase(key);
    }
    return '$' + _.kebabCase(key);
}


function quote(val) {
    return '"' + val + '"';
}


function makeName(paramName, basePath) {
    var _paramName = _.kebabCase(paramName);
    var humanName = _.startCase(paramName);
    var jsName = _.capitalize(_.camelCase(paramName));
    var className = paramName;
    var cssName = '.' + className;
    var dirName = Path.join(basePath, paramName);

    return {
        humanName: humanName,
        jsName: jsName,
        paramName: _paramName,
        className: className,
        cssName: cssName,
        dirName: dirName,
    };
}


var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
};


var mkdirpSync = function (dirpath) {
    var parts = dirpath.split(Path.sep);
    for (var i = 1; i <= parts.length; i++) {
        mkdirSync(Path.join.apply(null, parts.slice(0, i)));
    }
};


module.exports = {
    'makeCSSVariable': makeCSSVariable,
    'makeCSSName': makeCSSName,
    'makeName': makeName,
    'quote': quote,
    mkdirSync: mkdirSync,
    mkdirpSync: mkdirpSync,
};
