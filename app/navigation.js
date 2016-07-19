var _ = require('lodash');
var path  = require('path');
var nconf = require('nconf');


var formatNavItem = function(item, parent={}) {
  item.id = _.kebabCase(item.label);

  if (!item.path && parent.path) {
    item.path = path.join(parent.path, item.id);
  }

  if (item.children) {
    item.children = item.children.map(function(i) {
        return formatNavItem(i, item)
    });
  }

  return item;
};

exports.formatNavItem = formatNavItem;


module.exports = {
    nav: formatNavItem(nconf.get('navigation'))
}
