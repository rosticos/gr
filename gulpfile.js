var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

gulp.task('serve', function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    gulp.watch("./src/components/*.js").on("change", reload);
    gulp.watch("./src/*").on("change", reload);
});
