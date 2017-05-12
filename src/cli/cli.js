const yargs = require('yargs');
const gulp = require('gulp');
const gulpfile = require('../gulpfile');

const run = (argv = process.argv.slice(2), project = process.cwd()) => {
    // eslint-disable-next-line no-param-reassign
    argv = yargs(argv)
        .usage('Usage: <cmd> [args] [--config=<pathToConfigFile>]')
        .command({
            command: 'start',
            desc: 'Start the live server',
            handler: (argv) => {
                gulp.start('watch');
            },
        })
        .command({
            command: 'component',
            desc: '',
            handler: (argv) => {
                gulp.start('component');
            },
        })
        .command({
            command: 'uncomponent',
            desc: '',
            handler: (argv) => {
                gulp.start('uncomponent');
            },
        })
        .command({
            command: 'tokens',
            desc: '',
            handler: (argv) => {
                gulp.start('tokens');
            },
        })
        .help()
        .alias('help', 'h')
        .epilogue('Documentation: https://springload.github.io/rikki-patterns/')
        .argv;
};

module.exports.run = run;
