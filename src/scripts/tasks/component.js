const gulp = require('gulp');
const Path = require('path');
const nunjucks = require('nunjucks');
const transform = require('vinyl-transform');
const map = require('map-stream');
const rename = require('gulp-rename');
const yaml = require('js-yaml');
const yamlFront = require('yaml-front-matter');
const fs = require('fs');
const del = require('del');
const yargs = require('yargs');

const config = require('../../config');
const utils = require('../../site/utils');

const makeName = utils.makeName;
const basePath = config.paths.ui.components;

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
    const htmlFile = Path.join(basePath, 'components.html');
    const data = `\n{% macro ${name.replace('-', '_')}() %}{{ _component('${name}', kwargs) }}{% endmacro %}`;
    fs.appendFileSync(htmlFile, data);
}

function removeFromComponentsMacro(name) {
    const htmlFile = Path.join(basePath, 'components.html');
    const htmlContents = fs.readFileSync(htmlFile, { encoding: 'utf8' });
    const data = `{% macro ${name.replace('-', '_')}() %}{{ _component('${name}', kwargs) }}{% endmacro %}`;
    const match = htmlContents.includes(data);

    if (match) {
        const newHtmlContents = htmlContents.replace(data, '');
        fs.writeFileSync(htmlFile, newHtmlContents);
    }
}

gulp.task('uncomponent', () => {
    const argv = yargs.argv;
    const name = argv.name;
    const component = makeName(name, basePath);
    const compPath = Path.join(basePath, component.paramName);

    removeFromManifest(component.paramName);
    removeFromComponentsMacro(component.paramName);

    console.log('[Deleting]', Path.join(__dirname, '..', '..', compPath));

    return del([compPath]);
});

gulp.task('component', () => {
    const argv = yargs.argv;
    const name = argv.name;
    const component = makeName(name, basePath);
    const compPath = Path.join(basePath, component.paramName);

    console.log('[Writing]', Path.join(__dirname, '..', '..', compPath));

    const template = transform(() => {
        return map((chunk, next) => {
            const str = chunk.toString();
            const result = nunjucks.renderString(str, { data: component });
            return next(null, result);
        });
    });

    function renameTemplate(filepath) {
        if (filepath.extname === '.html' || filepath.extname === '.scss') {
            // eslint-disable-next-line no-param-reassign
            filepath.basename = component.paramName;
        }
    }

    // Automagically add to the components manifest.
    addToComponentsManifest(component.paramName);
    addToComponentsMacro(component.paramName);

    gulp.src(config.paths.generator.template).pipe(template).pipe(rename(renameTemplate)).pipe(gulp.dest(compPath));
});
