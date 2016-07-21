"use strict";

module.exports = (gulp) => {
  require('./server')(gulp);
  require('./scss')(gulp);
  require('./tokens')(gulp);
  require('./ui')(gulp);
  require('./site')(gulp);
  require('./component')(gulp);
  require('./watch')(gulp);
}
