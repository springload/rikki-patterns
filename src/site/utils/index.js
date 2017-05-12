const _ = require('lodash');
const Path = require('path');
const fs = require('fs');

function makeCSSName(prefix, key) {
    if (prefix) {
        return `$${prefix}-${_.kebabCase(key)}`;
    }
    return `$${_.kebabCase(key)}`;
}

function makeCSSVariable(prefix, key, val) {
    return `${makeCSSName(prefix, key)}: ${val};`;
}

function quote(val) {
    return `"${val}"`;
}

function makeName(paramName, basePath) {
    const paramNameKebab = _.kebabCase(paramName);
    const humanName = _.startCase(paramName);
    const jsName = _.capitalize(_.camelCase(paramName));
    const className = paramName;
    const cssName = `.${className}`;
    const dirName = Path.join(basePath, paramName);

    return {
        humanName: humanName,
        jsName: jsName,
        paramName: paramNameKebab,
        className: className,
        cssName: cssName,
        dirName: dirName,
    };
}

const mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code !== 'EEXIST') throw e;
    }
};

const mkdirpSync = function (dirpath) {
    const parts = dirpath.split(Path.sep);
    for (let i = 1; i <= parts.length; i++) {
        mkdirSync(Path.join.apply(null, parts.slice(0, i)));
    }
};

module.exports = {
    makeCSSVariable: makeCSSVariable,
    makeCSSName: makeCSSName,
    makeName: makeName,
    quote: quote,
    mkdirSync: mkdirSync,
    mkdirpSync: mkdirpSync,
};
