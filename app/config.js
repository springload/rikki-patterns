'use strict';

const fs = require('fs');
const nconf = require('nconf');
const Path = require('path');

const configPaths = [
    {
        name: null,
        path: Path.join('config', 'default.js'),
    },
    {
        name: 'navigation',
        path: Path.join('config', 'navigation.js'),
    },
];

const existsSync = (filename) => {
    try {
        fs.accessSync(filename);
        return true;
    } catch(ex) {
        return false;
    }
}


const jsFileLoader = (file) => {
    return {
        file: file,
        format: {
            parse: (data, options) => {
                return require(Path.relative(__dirname, file));
            },
            stringify: (data, options) => JSON.stringify(data),
        }
    }
};


nconf.argv().env();

configPaths.forEach(obj => {
    let configPath = obj.path;

    if (!existsSync(configPath)) {
        configPath = Path.join(__dirname, '..', configPath);
    }

    if (obj.name === null) {
        nconf.file(jsFileLoader(configPath));
    } else {
        nconf.file(obj.name, jsFileLoader(configPath));
    }
});


module.exports = nconf;
