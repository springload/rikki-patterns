const usage = 'Usage: $0 [--config=<pathToConfigFile>]';
const docs = 'Documentation: https://springload.github.io/rikki-patterns/';

const options = {
    automock: {
        default: undefined,
        description: 'Automock all files by default.',
        type: 'boolean',
    },
};

const check = (argv) => {

    return true;
};

module.exports = {
    usage,
    docs,
    check,
    options,
};
