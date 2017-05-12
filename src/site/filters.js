const path = require('path');
const nunjucks = require('nunjucks');
const marked = require('marked');
const beautify = require('js-beautify');
const slugify = require('slugify');

const config = require('../config');
const { findComponent, getStateFromFlavour } = require('../scripts/tasks/ui');

const isComponentReference = val => val && val.type && val.flavour && val.variant;

const renderComponentReference = (ref) => {
    const subComponent = findComponent(ref.type);
    const subState = getStateFromFlavour(subComponent, ref.flavour, ref.variant);

    return nunjucks.render(path.join(config.paths.ui.components, ref.type, `${ref.type}.html`), {
        component: subState.data,
    });
};

const loadComponentReferences = (val) => {
    let ret;

    if (isComponentReference(val)) {
        ret = renderComponentReference(val);
    } else if (Array.isArray(val)) {
        ret = val.map(v => (isComponentReference(v) ? renderComponentReference(v) : v)).join('');
    } else {
        ret = val;
    }

    return nunjucks.runtime.markSafe(ret);
};

/**
 * All of the Nunjucks filters available for templates to use.
 */
module.exports = {
    // Process text as markdown.
    markdown: str => (str && marked(str)) || '',
    // Prettify code (HTML prettifier).
    pretty: beautify.html,
    // Slugify.
    slugify: slugify,
    // Format a value as if it was a Python value.
    python_value: (val) => {
        if (isComponentReference(val)) {
            return '{...}';
        }

        switch (val) {
        case true:
            return 'True';
        case false:
            return 'False';
        case null:
            return 'None';
        default:
            return JSON.stringify(val);
        }
    },
    // Format a value as if it was a React prop.
    reactProp: val => (typeof val === 'string' ? `"${val}"` : `{${JSON.stringify(val)}}`),
    // Load component refereces.
    richtext: loadComponentReferences,
    // Override filter to load component refereces.
    safe: loadComponentReferences,
};
