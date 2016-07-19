import _ from 'lodash';
import fs from 'fs';
import Path from 'path';
import nconf from 'nconf';

import {
  getSchema,
  pathTrimStart,
  findComponent,
  getStateFromFlavour,
  getTokens
} from '../scripts/tasks/ui';

import {nav} from './navigation';


export const getComponentData = (data) => {
    let {id, path} = data;
    let componentData = findComponent(id);
    componentData.template = pathTrimStart(Path.join(path, id + '.html'));
    return componentData;
}


export const getComponentFromNav = (nav, name) => {
    let components = _.find(nav.children, {'id': 'components'});
    return _.find(components.children, {'id': name});
}


export const componentOverviewView = (req, res, next) => {
    let {name, flavour, variant} = req.params;
    let navData = getComponentFromNav(nav, name);
    let data = getComponentData(navData);

    res.render('component.html', {
        component: data,
        navigation: nav,
        config: nconf.get('app'),
        tokens: getTokens()
    });
}

export const componentRawView = (req, res, next) => {
    let {name, flavour, variant} = req.params;
    let navData = getComponentFromNav(nav, name);
    let component = getComponentData(navData);
    let state = getStateFromFlavour(component, flavour, variant);

    res.render('component-raw.html', {
        component: component,
        navigation: nav,
        state: state,
        config: nconf.get('app'),
        tokens: getTokens()
    });
}

export const autoIndexify = (page) => {
    return page === '' ? 'index' : page;
}


export const generic = (req, res, next) => {
    let page = req.params[0];
    page = pathTrimStart(page);
    page = autoIndexify(page);

    let tokens = getTokens();
    let colours = _.find(tokens, {name: 'aliases'});

    res.render(`${page}.html`, {
        navigation: nav,
        config: nconf.get('app'),
        tokens: getTokens(),
        colours: colours ? colours.items : [],
    });
}
