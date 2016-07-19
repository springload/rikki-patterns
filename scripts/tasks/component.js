var gulp = require('gulp');
var gutil = require('gulp-util');
var Path = require('path');
var nunjucks = require('nunjucks');
var transform = require('vinyl-transform')
var _ = require('lodash');
var map = require('map-stream');
var rename = require('gulp-rename');
var yaml = require('js-yaml');
var fs = require('fs');
var del = require('del');


var nconf = require('../../app/config');
var utils = require('../../app/utils');

var makeName = utils.makeName;
var basePath = nconf.get('paths:components');


function addToComponentsManifest(name) {
    var yamlFile = Path.join(basePath, 'config.yaml');
    var dumpOpts = {};
    var data = yaml.safeLoad(fs.readFileSync(yamlFile).toString());

    if (data.components.indexOf(name) < 0) {
        data.components.push(name);
    }

    fs.writeFileSync(yamlFile, yaml.safeDump(data, dumpOpts));
}

function removeFromManifest(name) {
    var yamlFile = Path.join(basePath, 'config.yaml');
    var dumpOpts = {};
    var data = yaml.safeLoad(fs.readFileSync(yamlFile).toString());

    var index = data.components.indexOf(name);
    if (index > -1) {
        data.components.splice(index, 1);
    }

    fs.writeFileSync(yamlFile, yaml.safeDump(data, dumpOpts));
}


gulp.task('uncomponent', function() {
    var argv = require('yargs').argv;
    var name = argv.name;
    var component = makeName(name, basePath);
    var compPath = Path.join(basePath, component.paramName);

    removeFromManifest(component.paramName);

    console.log('[Deleting]', Path.join(__dirname, '..', '..', compPath));

    return del([compPath]);
});


gulp.task('component', function() {
    var argv = require('yargs').argv;
    var name = argv.name;
    var component = makeName(name, basePath);
    var compPath = Path.join(basePath, component.paramName);

    console.log('[Writing]', Path.join(__dirname, '..', '..', compPath));

    var template = transform(function(filename) {
        return map(function(chunk, next) {
            var str = chunk.toString();
            var result = nunjucks.renderString(str, { data: component });
            return next(null, result);
        })
    });

    function renameTemplate(filepath) {
        if (filepath.extname === '.html') {
            filepath.basename = component.paramName;
        }
    }

    // Automagically add to the components manifest.
    addToComponentsManifest(component.paramName);

    gulp.src(nconf.get('paths:generator:template'))
        .pipe(template)
        .pipe(rename(renameTemplate))
        .pipe(gulp.dest(compPath));
});
