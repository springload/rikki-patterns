'use strict';

const nconf = require('nconf');
const Path = require('path');

const confPath = Path.join(__dirname, '..', 'config', 'default.js');
const navPath = Path.join(__dirname, '..', 'config', 'navigation.js');

const jsFileLoader = (file) => {
  return {
    file: file,
    format: {
      parse: (data, options) => require(file),
      stringify: (data, options) => JSON.stringify(data),
    }
  }
};

nconf.argv().env();
nconf.file(jsFileLoader(confPath));
nconf.file('navigation', jsFileLoader(navPath));

module.exports = nconf;
