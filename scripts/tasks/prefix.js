'use strict';

const config = require('../../app/config');

const prefix = (str) => {
  let prefix = config.get('taskPrefix');
  return `${prefix}:${str}`;
}

module.exports = prefix;
