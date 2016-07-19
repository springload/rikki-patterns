import Path from 'path';
import fs from 'fs';
import changeCase from 'change-case';

import Promise from 'bluebird';
import {makeCSSName} from './utils';

Promise.promisifyAll(fs);

const TOKEN_PATH = Path.join(__dirname, '..', 'ui', 'tokens', 'aliases.json');

const tokenize = (data) => {
    let items = [];

    for (let key in data) {
        let val = data[key];
        items.push({key, val});
    }

    return items.map(item => {
        let {key, val} = item;
        return {
            humanName: _.startCase(_.lowerCase(key)),
            cssName: makeCSSName('color', key)
            key,
            val,
        }
    })
}

const tokenLoader = (tokenType) => {
    return fs.readFileAsync(TOKEN_PATH, 'utf-8').then(fileData => {
        return tokenize(JSON.parse(fileData));
    })
}

export default tokenLoader;
