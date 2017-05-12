const _ = require('lodash');
const path  = require('path');
const getUI = require('../scripts/tasks/ui').getUI;

const formatNavItem = (item, parent) => {
    const id = _.kebabCase(item.label);

    const newItem = Object.assign({}, item, {
        id: id,
        path: item.path || path.join(parent.path, id),
    });

    if (newItem.children) {
        newItem.children = newItem.children.map(i => formatNavItem(i, newItem));
    }

    return newItem;
};

const getNavigation = () => {
    return formatNavItem({
        label: 'Root',
        path: '/',
        children: [
            // {
            //     label: 'Getting Started',
            //     children: [
            //         { label: 'CSS' },
            //         { label: 'How To' },
            //     ],
            // },
            {
                label: 'Design',
                children: [
                    // {
                    //     label: 'Overview',
                    // },
                    // {
                    //     label: 'Layout',
                    // },
                    {
                        label: 'Colours',
                    },
                    // {
                    //     label: 'Typography',
                    // },
                ],
            },
            {
                label: 'Components',
                children: getUI('components').map(component => ({ label: component.title })),
            },
            // {
            //     label: 'Style and Tone',
            // },
            // {
            //     label: 'Give Feedback',
            //     path: 'https://github.com/springload/rikki-patterns/issues',
            //     internal: false,
            // },
        ],
    });
};

module.exports = {
    getNavigation: getNavigation,
};
