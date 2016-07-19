import nconf from 'nconf';
import Path from 'path';

const navPath = Path.join(__dirname, '..', 'config', 'navigation.js');
const confPath = Path.join(__dirname, '..', 'config', 'index.json');

const jsFileLoader = (file) => {
  return {
    file: file,
    format: {
      parse: (data, options) => {
        return require(file);
      },
      stringify: (data, options) => {
        return JSON.stringify(data);
      },
    }
  }
};

nconf.argv().env();
nconf.file({file: confPath});
nconf.file(jsFileLoader(navPath));
nconf.use('memory');

module.exports = nconf;
