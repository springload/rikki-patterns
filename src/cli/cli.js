const yargs = require('yargs');
const gulp = require('gulp');
require('../gulpfile');

// eslint-disable-next-line
const run = (argv = process.argv.slice(2)) => {
    // eslint-disable-next-line no-param-reassign
    argv = yargs(argv)
        .usage('Usage: <cmd> [args] [--config=<pathToConfigFile>]')
        .command({
            command: 'start',
            desc: 'Start the live server',
            handler: () => {
                gulp.start('watch');
            },
        })
        .command({
            command: 'static',
            desc: 'Output as a static site',
            handler: () => {
                gulp.start('site');
            },
        })
        .command({
            command: 'component',
            desc: '',
            handler: () => {
                gulp.start('component');
            },
        })
        .command({
            command: 'uncomponent',
            desc: '',
            handler: () => {
                gulp.start('uncomponent');
            },
        })
        .command({
            command: 'tokens',
            desc: '',
            handler: () => {
                gulp.start('tokens');
            },
        })
        .help()
        .alias('help', 'h')
        .epilogue('Documentation: https://springload.github.io/rikki-patterns/')
        .argv;
};

module.exports.run = run;
