const _ = require('lodash');
const path = require('path');

const { pathTrimStart, findComponent, getStateFromFlavour, getTokens } = require('../scripts/tasks/ui');
const { getNavigation } = require('./navigation');
const config = require('../config');

// data format: { label: 'Foo', id: 'foo', path: '/components/foo' }
function getComponentData(data) {
    const component = findComponent(data.id);
    component.template = pathTrimStart(path.join(data.path, data.id + '.html'));
    return component;
}

function getComponentFromNav(nav, name) {
    const components = _.find(nav.children, { id: 'components' });
    return _.find(components.children, { id: name });
}

const autoIndexify = page => (page === '' ? 'index' : page);

module.exports = {
    getComponentData: getComponentData,

    componentRawView(req, res) {
        const { name, flavour, variant } = req.params;
        const nav = getNavigation();
        const navData = getComponentFromNav(nav, name);
        const component = getComponentData(navData);
        const state = getStateFromFlavour(component, flavour, variant);

        res.render('component-raw.html', {
            component: component,
            state: state,
        });
    },

    componentOverviewView(req, res) {
        const { name } = req.params;
        const nav = getNavigation();
        const navData = getComponentFromNav(nav, name);
        const data = getComponentData(navData);

        res.render('component.html', {
            component: data,
            navigation: nav,
            config: config,
            tokens: getTokens(),
        });
    },

    generic(req, res) {
        const page = autoIndexify(pathTrimStart(req.params[0]));
        const nav = getNavigation();
        const tokens = getTokens();

        res.render(`${page}.html`, {
            navigation: nav,
            config: config,
            tokens: getTokens(),
            colours: _.find(tokens, { name: 'aliases' }).items,
        });
    },
};
