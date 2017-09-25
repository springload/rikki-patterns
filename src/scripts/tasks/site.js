const gulp = require('gulp');
const Path = require('path');
const transform = require('vinyl-transform');
const map = require('map-stream');
const fs = require('fs');
const _ = require('lodash');
const rename = require('gulp-rename');
const mkdirp = require('mkdirp');

const navigation = require('../../site/navigation');
const templates = require('../../site/templates');
const config = require('../../config');

// Destructuring, old school.
const ui = require('./ui');

const pathTrimStart = ui.pathTrimStart;
const findComponent = ui.findComponent;
const getStateFromFlavour = ui.getStateFromFlavour;
const getTokens = ui.getTokens;

gulp.task('site:pages', () => {
    const dir = config.paths.site.pages;
    const env = templates.configure();

    const render = transform(() => {
        return map((chunk, next) => {
            const str = chunk.toString();
            const tokens = getTokens();

            const html = env.renderString(str, {
                navigation: navigation.getNavigation(),
                config: config,
                tokens: tokens,
                colours: _.find(tokens, { name: 'aliases' }).items,
            });
            return next(null, html);
        });
    });

    function renameDirectory(filepath) {
        if (filepath.basename !== 'index') {
            // eslint-disable-next-line no-param-reassign
            filepath.dirname = Path.join(filepath.dirname, filepath.basename);
            // eslint-disable-next-line no-param-reassign
            filepath.basename = 'index';
        }
    }

    return gulp
        .src([Path.join(dir, '**/*')])
        .pipe(render)
        .pipe(rename(renameDirectory))
        .pipe(gulp.dest(config.paths.staticSite.root));
});

gulp.task('site:static', () => {
    gulp
        .src(Path.join(config.paths.site.static, '**'))
        .pipe(gulp.dest(config.paths.staticSite.static));
});

// Renders the `raw` view of each component's state
function renderState(env, stateDir, nav, componentData, state) {
    const statePath = Path.join(stateDir, 'index.html');

    const raw = env.render('component-raw.html', {
        navigation: nav,
        component: componentData,
        state: state,
        config: config,
        tokens: getTokens(),
    });

    mkdirp.sync(stateDir);
    fs.writeFileSync(statePath, raw, 'utf-8');
}

// Renders the documentation for each component
function renderDocs(SITE_DIR, name) {
    const env = templates.configure();
    const nav = navigation.getNavigation();
    const components = _.find(nav.children, { id: name });

    components.children.forEach(component => {
        const dirPath = Path.join(SITE_DIR, component.path);
        console.log(dirPath);
        const htmlPath = Path.join(dirPath, 'index.html');
        const rawDir = Path.join(SITE_DIR, 'raw', component.id);

        const componentData = findComponent(component.id);
        componentData.template = pathTrimStart(
            Path.join(component.path, `${component.id}.html`),
        );

        const html = env.render('component.html', {
            navigation: nav,
            component: componentData,
            config: config,
            tokens: getTokens(),
        });

        mkdirp.sync(rawDir);
        mkdirp.sync(dirPath);

        fs.writeFileSync(htmlPath, html, 'utf-8');

        if (componentData.flavours) {
            componentData.flavours.forEach(flavour => {
                if (flavour.states) {
                    flavour.states.forEach(variant => {
                        const state = getStateFromFlavour(
                            componentData,
                            flavour.id,
                            variant.id,
                        );
                        const stateDir = Path.join(
                            rawDir,
                            flavour.id,
                            variant.id,
                        );
                        renderState(env, stateDir, nav, componentData, state);
                    });
                }

                if (flavour.state) {
                    const stateDir = Path.join(rawDir, flavour.id);
                    renderState(
                        env,
                        stateDir,
                        nav,
                        componentData,
                        flavour.state,
                    );
                }
            });
        }
    });
}

gulp.task('site', ['site:pages', 'site:static'], done => {
    renderDocs(config.paths.staticSite.root, 'components');
    done(null);
    process.exit(0);
});
