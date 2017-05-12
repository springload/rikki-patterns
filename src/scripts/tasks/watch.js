const gulp = require('gulp');
const path = require('path');
const config = require('../../config');

gulp.task('watch', ['tokens', 'scss', 'scss:site'], () => {
    // Start the server.
    // eslint-disable-next-line
    require('../../site/server');

    gulp.watch(path.join('.', 'site', 'scss', '**', '*.scss'), ['scss:site']);

    gulp.watch(
        [path.join(config.paths.ui.scss, '**', '*.scss'), path.join(config.paths.ui.components, '**', '*.scss')],
        ['scss'],
    );

    gulp.watch(path.join(config.paths.ui.tokens, '**', '*.json'), ['tokens']);
});
