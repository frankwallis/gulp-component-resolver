gulp-component-resolver
=======================

resolve a stream of files using specific remote and local fields of component.json

components which have been linked using `component link` can optionally use the same fields as local components

useful for setting up watch tasks for component builds which follow symbolic links and bundling test scripts

### Usage ###

`resolve.scripts(options?)`
`resolve.files(options?)`
`resolve.styles(options?)`
`resolve.custom(options)`

options: see [component-resolve-fields](https://github.com/frankwallis/component-resolve-fields)

### Example ###

```js
    gulp.task('cucumber', function (cb) {
        var resolve = require("gulp-component-resolver");
        var protractor = require("gulp-protractor").protractor;
        var cmdargs = getArgs(options);

        var resolveOpts = {
        	localFields: [ "features", "mocks" ],
        	remoteFields: [ "mocks" ]
        }

        return gulp.src('component.json')
            .pipe(resolve.custom({ fields: ['features'] }))
            .pipe(protractor({
                configFile: 'protractor.conf.js'
            })) 
            .on('error', function(e) { throw e })
            .on('end', cb);
    });


    component.json:

    {
  		"name": "app",
	  	"dependencies": {
    		"components/angular": ">=1.3.x"
  		},
  		"main": "src/index.ts",
  		
  		"scripts": [ "src/**/*.ts" ],
  		"styles": [ "src/**/*.css" ],
  		"templates": [ "src/**/*.html" ],
  		"e2e": [ "e2e/**/*.js", "e2e/**/*.ts" ],
  		"specs": [ "src/**/*-spec.ts" ],
  		"mocks": [ "src/**/*-mock.ts" ],
  		"schemas": [ "schemas/**/*.edn" ],
  		"features": [ "cucumber/**/*.feature" ],
  }
}
```
