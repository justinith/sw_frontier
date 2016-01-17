var fs         = require('fs'),
    gulp       = require('gulp'),
    connect    = require('gulp-connect'),
    usemin     = require('gulp-usemin'),
    uglify     = require('gulp-uglify'),
    minifyCss  = require('gulp-minify-css'),
    concat     = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    clean      = require('gulp-clean'),
    replace    = require('gulp-replace'),
    watch      = require('gulp-watch'),
    sourcemaps = require("gulp-sourcemaps"),
    stripDebug = require('gulp-removelogs'),
    babel      = require('gulp-babel');

var
    dir = {
        src: {
            root: 'src/',
            auth: 'src/auth/',
            admin: 'src/admin/',
            stat: 'src/'
        },
        build: {
            root: 'build/',
            auth: 'build/auth/',
            admin: 'build/admin/',
            stat: 'build/'
        }
    };

gulp.task('s', () => {
    connect.server({
        port: 9001,
        root: 'dev/',
        host: '127.0.0.1'
    })
});


gulp.task('build-vendor', () => {
    return buildVendor(dir.build.root);
});

gulp.task('build-scripts', function () {

    return gulp.src(['src/app/app.module.js', 'src/**/*.module.js', 'src/**/*.js', '!src/bower_components/**/*'])
        .pipe(concat('scripts.js'))
        .pipe(stripDebug())
        .pipe(gulp.dest('build/bower_components/'));
});

//
//gulp.task('build-auth', () => {
//    BuildSubModules('auth');
//});
//gulp.task('build-admin', () => {
//    BuildSubModules('admin');
//});

gulp.task('build-copy', () => {
    copy([`${dir.src.stat}/assets/fonts/**/*`], `${dir.build.stat}/assets/fonts/`);
    copy([`${dir.src.root}/favicon.ico`], `${dir.build.stat}/`);
    copy([`${dir.src.root}**/*.tpl.html`], dir.build.root);
});

gulp.task('clean', () => {
    return gulp.src(`${dir.build.root}*`)
        .pipe(clean());
});


gulp.task('build', ['clean'], function () {
    //'build-auth', 'build-admin',
    return gulp.start(['build-vendor', 'build-scripts', 'build-copy']);
});


gulp.task('dev-scripts', function () {
    return gulp.src(['src/app/app.module.js', 'src/**/*.module.js', 'src/**/*.js', '!src/bower_components/**/*'])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dev/bower_components/'));
});
gulp.task('dev-usemin', function () {
    return gulp.src('src/index.html')
        .pipe(usemin({
            css: [replace('../fonts', '/assets/fonts'), 'concat'],
            js: ['concat']
        }))
        .pipe(gulp.dest('dev/'));
});

gulp.task('dev-copy', function () {
    copy('src/**/*.tpl.html', 'dev');
    copy('src/assets/fonts/*', 'dev/assets/fonts');
    copy('src/assets/images/*', 'dev/assets/images')
});

gulp.task('dev', ['dev-copy', 'dev-usemin', 'dev-scripts'], function () {
    watch('src/**/*.js', function () {
        gulp.start(['dev-scripts']);
    });
    watch('src/**/*.tpl.html', function () {
        gulp.start(['dev-copy']);
    });
    watch('src/index.html', function () {
        gulp.start(['dev-usemin']);
    });
    watch('src/**/*.css', function () {
        gulp.start(['dev-usemin']);
    });
    gulp.start(['s']);

});


function BuildSubModules (folderTypeName) {
    var source = dir.src[folderTypeName];
    fs.readdir(source, (err, folders) => {
        if (err) throw err;
        folders.forEach(function (componentFileName) {
            gulp.src(`${source}${componentFileName}/**/*.js`)
                .pipe(concat(`${componentFileName}.js`))
                .pipe(ngAnnotate())
                .pipe(gulp.dest(`${dir.build[folderTypeName]}${componentFileName}/`))
        })
    });

}

var buildVendor = (dest) => {

    return gulp.src(`${dir.src.root}index.html`)
        .pipe(usemin({
            css: [replace('../fonts', '/assets/fonts'), 'concat'],
            js: ['concat']
        }))
        .pipe(gulp.dest(dest));
};

function copy (src, dest) {
    return gulp.src(src)
        .pipe(gulp.dest(dest));
}