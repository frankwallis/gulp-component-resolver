var gulp = require("gulp");
var componentStream = require("./");
var print = require("gulp-print");

gulp.task('default', function() {
	return gulp.src('component.json')
		.pipe(componentStream.scripts())
		.pipe(print());
})