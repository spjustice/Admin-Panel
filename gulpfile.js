let project_folder = "dist";
let sourse_folder = "src";

let path = {
   build: {
      html: project_folder + "/",
      css: project_folder + "/css",
      js: project_folder + "/js",
      img: project_folder + "/img",
      fonts: project_folder + "/fonts/",
   },
   src: {
      html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
      css: sourse_folder + "/scss/style.scss",
      js: [
         'node_modules/jquery/dist/jquery.min.js',
         sourse_folder + "/js/main.js",
      ],
      img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: sourse_folder + "/fonts/**/*",
   },
   watch: {
      html: sourse_folder + "/**/*.html",
      css: sourse_folder + "/scss/**/*.scss",
      js: sourse_folder + "/js/**/*.js",
      img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
   },
   clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
   gulp = require('gulp'),
   browsersync = require('browser-sync').create(),
   fileinclude = require('gulp-file-include'),
   del = require('del'),
   scss = require('gulp-sass')(require('sass')),
   autoprefixer = require('gulp-autoprefixer'),
   clean_css = require('gulp-clean-css'),
   rename = require('gulp-rename'),
   uglify = require('gulp-uglify-es').default,
   imagemin = require('gulp-imagemin'),
   webp = require('gulp-webp'),
   webphtml = require('gulp-webp-html'),
   webpcss = require('gulp-webpcss'),
   svgSprite = require('gulp-svg-sprite'),
   ttf2woff = require('gulp-ttf2woff'),
   ttf2woff2 = require('gulp-ttf2woff2'),
   concat = require('gulp-concat');

function browserSync(params) {
   browsersync.init({
      server: {
         baseDir: "./" + project_folder + "/"
      },
      port: 3000,
      notify: false
   })
}

function html() {
   return src(path.src.html)
      .pipe(fileinclude())
      .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}
function images() {
   return src(path.src.img)
      .pipe(
         webp({
            quality: 70
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizaationLevel: 3
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
};
function fonts() {
   return src(path.src.fonts)
      .pipe(dest(path.build.fonts));

};

// gulp.task('svgSprite', function () {
//    return gulp.src([sourse_folder + '/iconsprite/*.svg'])
//       .pipe(svgSprite({
//          mode: {
//             stack: {
//                sprite: "../icons/icons.svg",
//                example: true
//             }
//          }
//       }))
//       .pipe(dest(path.build.img))
// })

function css() {
   return src(path.src.css)
      .pipe(
         scss({
            outputStyle: "expanded"
         })
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
         })
      )
      .pipe(webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(
         uglify()
      )
      .pipe(concat('main.min.js'))
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function watchfiles() {
   gulp.watch([path.watch.html], html)
   gulp.watch([path.watch.css], css)
   gulp.watch([path.watch.js], js)
   gulp.watch([path.watch.img], images)
}
function clean() {
   return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchfiles, browserSync);


exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
