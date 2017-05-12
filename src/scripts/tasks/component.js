var gulp = require('gulp');
var Path = require('path');
var nunjucks = require('nunjucks');
var transform = require('vinyl-transform');
var map = require('map-stream');
var rename = require('gulp-rename');
var yaml = require('js-yaml');
const yamlFront = require('yaml-front-matter');
var fs = require('fs');
var del = require('del');

var config = require('../../config');
var utils = require('../../site/utils');

var makeName = utils.makeName;
var basePath = config.paths.components;

const updateManifest = (callback) => {
    const manifestPath = Path.join(basePath, 'README.md');
    const manifest = yamlFront.loadFront(manifestPath, 'readme');
    const readme = manifest.readme;
    delete manifest.readme;

    callback(manifest);

    const newManifest = `---\n${yaml.safeDump(manifest)}---\n${readme}`;

    fs.writeFileSync(manifestPath, newManifest);
};

function addToComponentsManifest(name) {
    updateManifest((manifest) => {
        if (manifest.components.indexOf(name) === -1) {
            manifest.components.push(name);
        }
    });
}

function removeFromManifest(name) {
    updateManifest((manifest) => {
        const index = manifest.components.indexOf(name);
        if (index !== -1) {
            manifest.components.splice(index, 1);
        }
    });
}


function addToComponentsMacro(name) {
    var htmlFile = Path.join(basePath, 'rikki.html');
    var data = '\n{% macro ' + name.replace('-', '_') + '() %}{{ _component(\'' + name + '\', kwargs) }}{% endmacro %}';
    fs.appendFileSync(htmlFile, data);
}

function removeFromComponentsMacro(name) {
    var htmlFile = Path.join(basePath, 'rikki.html');
    var htmlContents = fs.readFileSync(htmlFile, { encoding: 'utf8' });
    var data = '{% macro ' + name.replace('-', '_') + '() %}{{ _component(\'' + name + '\', kwargs) }}{% endmacro %}';
    var match = htmlContents.includes(data);

    if (match) {
        var newHtmlContents = htmlContents.replace(data, '');
        fs.writeFileSync(htmlFile, newHtmlContents);
    }
}

gulp.task('uncomponent', function () {
    var argv = require('yargs').argv;
    var name = argv.name;
    var component = makeName(name, basePath);
    var compPath = Path.join(basePath, component.paramName);

    removeFromManifest(component.paramName);
    removeFromComponentsMacro(component.paramName);

    console.log('[Deleting]', Path.join(__dirname, '..', '..', compPath));

    return del([compPath]);
});

gulp.task('component', function () {
    var argv = require('yargs').argv;
    var name = argv.name;
    var component = makeName(name, basePath);
    var compPath = Path.join(basePath, component.paramName);

    console.log('[Writing]', Path.join(__dirname, '..', '..', compPath));

    var template = transform(function (filename) {
        return map(function (chunk, next) {
            var str = chunk.toString();
            var result = nunjucks.renderString(str, { data: component });
            return next(null, result);
        });
    });

    function renameTemplate(filepath) {
        if (filepath.extname === '.html' || filepath.extname === '.scss') {
            filepath.basename = component.paramName;
        }
    }

    // Automagically add to the components manifest.
    addToComponentsManifest(component.paramName);
    addToComponentsMacro(component.paramName);

    gulp.src(config.paths.generator.template)
        .pipe(template)
        .pipe(rename(renameTemplate))
        .pipe(gulp.dest(compPath));
});
