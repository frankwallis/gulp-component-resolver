/*
* gulp-component-resolve
* https://github.com/frankwallis/gulp-component-resolve
*
* Copyright (c) 2014 Frank Wallis
* Licensed under the MIT license.
*/
var gutil = require('gulp-util');
var through = require('through2');
var builder = require("component-builder");
var resolver = require("component-resolver");

var fields = {
    scripts: [ "scripts", "templates", "json" ],
    files:   [ "files", "images", "fonts" ],
    styles:  [ "styles" ]
}

function scripts(options) {
    options = options || {};
    options.fields = options.fields || fields.scripts;
    return resolveStream(options, builder.scripts);
}

function files(options) {
    options = options || {};
    options.fields = options.fields || fields.files;
    return resolveStream(options, builder.files);
}

function styles(options) {
    options = options || {};
    options.fields = options.fields || fields.styles;
    return resolveStream(options, builder.styles);
}

function all(options) {
    options = options || {};
    options.fields = options.fields || fields.styles.concat(fields.scripts).concat(fields.files);
    return resolveStream(options, builder.files);
}

function custom(options, done) {
    if (!options)
        throw new Error("plesae provide some options");

    if (!options.fields)
        throw new Error("plesae provide some fields");
    
    return resolveStream(options, builder.files);
}

function resolveStream(options, buildFn) {

    var _stream = null;

    function eachFile(file, encoding, done) {
        _stream = this;

        if (file.isNull()) {
            _stream.emit('error', new gutil.PluginError('gulp-component-resolve', 'file is null'));
            _stream.push(file);
            return done();
        }

        if (file.isStream()) {
            _stream.emit('error', new gutil.PluginError('gulp-component-resolve', 'Streaming not supported'));
            return done();
        }

        resolve(done);
        return;
    }

    function resolve(done) {

        function add(file, cb) {
            var gfile = new gutil.File({ 
                cwd: file.cwd, 
                base: file.base, 
                path: file.filename, 
                contents: file.string 
            });
            _stream.push(gfile);
            
            file.extension = false;
            file.read = false;
            file.string = false;
            
            cb();
        }

        // resolve the dependency tree
        resolver(null, options, function (err, tree) {
            if (err)
                _stream.emit('error', new gutil.PluginError('gulp-component-resolve', err.message));
                
            var instance = buildFn(tree, opts);

            options.fields.forEach(function(fieldname) {
                instance.use(fieldname, add);
            });
           
           instance.end(function (err, string) {
                if (err) {
                    _stream.emit('error', new gutil.PluginError('gulp-component-resolve', err.message));
                    console.error(err);
                    done(err);
                }
                else {
                    _stream.emit('end');
                    done();
                }
            });
        });    
    }

    function endStream(done) {
        return done();
    }

    return through.obj(eachFile, endStream);
}

module.exports.all = all;
module.exports.files = files;
module.exports.styles = styles;
module.exports.scripts = scripts;
module.exports.custom = custom;
