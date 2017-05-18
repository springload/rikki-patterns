const _ = require('lodash');
const path = require('path');

function makeName(paramName, basePath) {
    const paramNameKebab = _.kebabCase(paramName);
    const humanName = _.startCase(paramName);
    const jsName = _.capitalize(_.camelCase(paramName));
    const className = paramName;
    const cssName = `.${className}`;
    const dirName = path.join(basePath, paramName);

    return {
        humanName: humanName,
        jsName: jsName,
        paramName: paramNameKebab,
        className: className,
        cssName: cssName,
        dirName: dirName,
    };
}

module.exports = {
    makeName: makeName,
};
