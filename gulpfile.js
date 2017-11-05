var gulp = require('gulp');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");
var del = require('del');
var runSequence = require('run-sequence');
gulp.task("typescript", function()
{
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});
gulp.task("clean", function()
{
    return del("./dist",{force:true});
});
gulp.task("default", function(callback)
{
    runSequence('clean','typescript', callback);
});