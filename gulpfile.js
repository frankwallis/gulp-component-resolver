var gulp = require("gulp");
var print = require("gulp-print");
var componentStream = require("./");

gulp.task('default', function() {
	return gulp.src('component.json')
		.pipe(componentStream.custom({ fields: ['scripts', 'json'] }))
		.pipe(print());
})