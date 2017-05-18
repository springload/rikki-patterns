const _ = require('lodash');

const makeCSSName = (key, prefix = '') => {
    if (prefix) {
        return `$${prefix}-${_.kebabCase(key)}`;
    }
    return `$${_.kebabCase(key)}`;
};

const makeCSSVariable = (prefix, key, val) => `${makeCSSName(key, prefix)}: ${val};`;

const mapToCSS = (prefix, item) => {
    return Object.assign({}, item, {
        humanName: _.startCase(_.lowerCase(item.name)),
        cssName: makeCSSName(item.name, prefix),
    });
};

const quote = val => `"${val}"`;

module.exports = {
    makeCSSName,
    makeCSSVariable,
    mapToCSS,
    quote,
};
