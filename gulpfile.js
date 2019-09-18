var gulp = require('gulp');
var run = require('gulp-run-command').default;
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");
var del = require('del');
var runSequence = require('run-sequence');
var gls = require('gulp-live-server');

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
gulp.task("docs", run("apidoc -i ./src/http -i ./src/socket -o ./apiDocs"));
gulp.task("start", run("node dist/startApi"));
gulp.task("default", function(callback)
{
    runSequence('clean','typescript', callback);
});
gulp.task('watch',['default'], function(){

    var server = gls.new('dist/startApi.js');
    server.start();
    gulp.watch('src/**/*.ts', function(file){
        console.log('Watch!');
        runSequence('clean','typescript', function () {
            server.stop().then(function () {
                server.start();
            })
        });
    });


});
