const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("sass", function() {
  gulp
    .src("./sass/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./css"));
});

gulp.task("default", function() {
  gulp.watch("./sass/**/*.+(scss|sass)", ["sass"]);
});
