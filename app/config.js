const nconf = require('nconf');
const Path = require('path');

const confPath = Path.join(__dirname, '..', 'config', 'default.js');
const navPath = Path.join(__dirname, '..', 'config', 'navigation.js');

const jsFileLoader = function (file) {
  return {
    file: file,
    format: {
      parse: function(data, options) {
        return require(file);
      },
      stringify: function(data, options) {
        return JSON.stringify(data);
      }
    }
  }
};

nconf.argv().env();
nconf.file(jsFileLoader(confPath));
nconf.file('navigation', jsFileLoader(navPath));

module.exports = nconf;
