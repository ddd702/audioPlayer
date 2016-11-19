'use strict';
var gulp=require('gulp');
var sass=require('gulp-sass');
var connect = require('gulp-connect');
var uglify =require('gulp-uglify');
var changed=require('gulp-changed');
var sourcemaps=require('gulp-sourcemaps');
var size = require('gulp-size');
var del=require('del');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
var distDir='./dist';
var srcConfig={
  sass:'./src/sass/**/*.scss',
  js:'./src/js/**/*.js',
  images:'./dist/images/**/*'
};
var destConfig={
  css:distDir+'/css',
  js:distDir+'/js'
};
function doWatchify() {
    let customOpts = {
        entries: 'src/js/index.js',
        debug: true,
        transform: [babelify]
    };
    let opts = Object.assign({}, watchify.args, customOpts);
    let b = watchify(browserify(opts));
    b.on('update', doBundle.bind(global, b));
    b.on('log', console.log.bind(console));

    return b;
}

function doBundle(b) {
    return b.bundle()
        .on('error', console.error.bind(console))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(destConfig.js));
}
gulp.task('connect', function() {
  connect.server({
    root: './',
    port: 9001,
    livereload: true
  });
});
gulp.task('del',function(){
	del(['dist']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});
	});
gulp.task('sass',function(){
  return gulp.src(srcConfig.sass).
  	  pipe(sourcemaps.init()).
      pipe(changed(destConfig.css)).
      pipe(sass({outputStyle:'compressed'}).on('error', sass.logError)).
      pipe(sourcemaps.write('./maps')).
      pipe(size()).
      pipe(gulp.dest(destConfig.css))
});
gulp.task('watch',function(){
  gulp.watch(srcConfig.sass, ['sass']);
   return doBundle(doWatchify());
});
gulp.task('default',function(){
  gulp.start('watch'); 
  gulp.start('connect');
});