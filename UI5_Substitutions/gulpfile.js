// npm install --save-dev gulp-ui5-preload gulp-uglify gulp-pretty-data gulp-if
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');

gulp.task('ui5preload', function(){
  return gulp.src([
                    'src/ui/**/**.+(js|xml)',
                    '!src/ui/thirdparty/**'
                  ])
          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify
          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata 
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'));
     })