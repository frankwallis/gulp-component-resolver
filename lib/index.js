/*
* gulp-component-resolver
* https://github.com/frankwallis/gulp-component-resolver
*
* Copyright (c) 2014 Frank Wallis
* Licensed under the MIT license.
*/

var path = require('path');
var gutil = require('gulp-util');
var through = require("through2");
var resolver = require("component-resolve-fields");

function scripts(options) {
    return resolveStream(options, resolver.scripts);
}

function files(options) {
    return resolveStream(options, resolver.files);
}

function styles(options) {
    return resolveStream(options, resolver.styles);
}

function custom(options) {
    if (!options)
        throw new Error("plesae provide some options");

    if (!options.fields)
        throw new Error("plesae provide some fields");
    
    return resolveStream(options, resolver.files);
}

function resolveStream(options, resolveFn) {

    var _stream = null;

    function eachFile(file, encoding, done) {
        _stream = this;

        if (file.isNull()) {
            _stream.emit('error', new gutil.PluginError('gulp-component-resolver', 'file is null'));
            _stream.push(file);
            return done();
        }

        if (file.isStream()) {
            _stream.emit('error', new gutil.PluginError('gulp-component-resolver', 'Streaming not supported'));
            return done();
        }

        if (path.basename(file.path) != 'component.json') {
            _stream.push(file);
            return done();
        }

        resolveAndEmit(done);
    }

    function endStream(done) {
        return done();
    }

    function resolveAndEmit(done) {

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

        function end(err) {
            if (err) 
                _stream.emit('error', new gutil.PluginError('gulp-component-resolver', err.message));
            else
                _stream.emit('end');

            done();
        }

        resolveFn(options, add, end);
    }

    return through.obj(eachFile, endStream);
}

module.exports.files = files;
module.exports.styles = styles;
module.exports.scripts = scripts;
module.exports.custom = custom;
