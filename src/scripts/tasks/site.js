var gulp = require('gulp');
var Path = require('path');
var transform = require('vinyl-transform');
var map = require('map-stream');
var fs = require('fs');
var _ = require('lodash');
var rename = require('gulp-rename');


var utils = require('../../site/utils');
var navigation = require('../../site/navigation');
var templates = require('../../site/templates');
var config = require('../../config');

// Destructuring, old school.
var ui = require('./ui');
var pathTrimStart = ui.pathTrimStart;
var findComponent = ui.findComponent;
var getStateFromFlavour = ui.getStateFromFlavour;
var getTokens = ui.getTokens;


gulp.task('site:pages', function () {
    var dir = config.paths.site.pages;
    var env = templates.configure();

    var render = transform(function (filename) {
        return map(function (chunk, next) {
            var str = chunk.toString();
            var tokens = getTokens();

            var html = env.renderString(str, {
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
            filepath.dirname = Path.join(filepath.dirname, filepath.basename);
            filepath.basename = 'index';
        }
    }

    return gulp.src([Path.join(dir, '**/*')])
        .pipe(render)
        .pipe(rename(renameDirectory))
        .pipe(gulp.dest(config.paths.staticSite.root));
});


gulp.task('site:static', function () {
    gulp.src(Path.join(config.paths.site.static, '**'))
        .pipe(gulp.dest(config.paths.staticSite.static));
});


// Renders the `raw` view of each component's state
function renderState(env, stateDir, nav, componentData, state) {
    var statePath = Path.join(stateDir, 'index.html');

    var raw = env.render('component-raw.html', {
        navigation: nav,
        component: componentData,
        state: state,
        config: config,
        tokens: getTokens(),
    });

    utils.mkdirpSync(stateDir);
    fs.writeFileSync(statePath, raw, 'utf-8');
    console.log(statePath);
}


// Renders the documentation for each component
function renderDocs(SITE_DIR, name) {
    var env = templates.configure();
    var nav = navigation.getNavigation();
    var components = _.find(nav.children, { id: name });

    components.children.forEach(function (component) {
        var dirPath = Path.join(SITE_DIR, component.path);
        var htmlPath = Path.join(dirPath, 'index.html');
        var rawDir = Path.join(SITE_DIR, 'raw', component.id);

        var componentData = findComponent(component.id);
        componentData.template = pathTrimStart(Path.join(component.path, component.id + '.html'));

        var html = env.render('component.html', {
            navigation: nav,
            component: componentData,
            config: config,
            tokens: getTokens(),
        });

        utils.mkdirpSync(rawDir);
        utils.mkdirpSync(dirPath);

        fs.writeFileSync(htmlPath, html, 'utf-8');

        if (componentData.flavours) {
            componentData.flavours.forEach(function (flavour) {
                if (flavour.states) {
                    flavour.states.forEach(function (variant) {
                        var state = getStateFromFlavour(componentData, flavour.id, variant.id);
                        var stateDir = Path.join(rawDir, flavour.id, variant.id);
                        renderState(env, stateDir, nav, componentData, state);
                    });
                }

                if (flavour.state) {
                    var stateDir = Path.join(rawDir, flavour.id);
                    renderState(env, stateDir, nav, componentData, flavour.state);
                }
            });
        }
    });
}


gulp.task('site', ['site:pages', 'site:static'], function (done) {
    renderDocs(config.paths.staticSite.root, 'components');
    done(null);
    process.exit(0);
});
