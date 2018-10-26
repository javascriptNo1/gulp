// 引入依赖gulp
var gulp = require('gulp');
// 引入es6语法的编译工具
var babel=require('gulp-babel');
//引入压缩js的插件
var uglify = require('gulp-uglify');
//引入重命名插件
var rename = require('gulp-rename');
//引入压缩css的插件
var cleanCss = require('gulp-clean-css');
//引入编译less插件
var less = require('gulp-less');
//引入压缩图片的插件
var imagemin = require('gulp-imagemin');
//引入删除的插件
var del = require('del');
//串行任务
var runSequence = require('run-sequence');
//引入热更新插件
var livereload = require('gulp-livereload');
//引入webserver
var  webserver = require('gulp-webserver');

let watch = require('gulp-watch');





// 开启压缩js的任务
gulp.task('uglify', function () {
    return gulp.src('./assets/scripts/js/*.js')               //确定源
        .pipe(watch('./assets/scripts/js/*.js'))
        // 压缩前对es6语法编译成es5写法
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())                //处理
        .pipe(rename({
            suffix: '.min'             // 重命名
        }))
        .pipe(gulp.dest('./assets/dist/js/'))   // 确定输出的路径
        .pipe(livereload());  //热更新
});


//压缩css
gulp.task('cleanCss', function () {
    return gulp.src('./assets/styles/css/*.css')   //源
        .pipe(watch('./assets/styles/css/*.css'))
        .pipe(cleanCss())            //处理
        .pipe(rename({
            suffix: '.min'           //重命名
        }))
        .pipe(gulp.dest('./assets/dist/css'))  // 目标
        .pipe(livereload());  //热更新
});


//编译less
gulp.task('less', function () {
    return gulp.src('./assets/styles/less/*.less')   //源
        .pipe(watch('./assets/styles/less/*.less'))
        .pipe(less())                  //处理
        .pipe(gulp.dest('./assets/styles/css'))  // 目标
        .pipe(livereload());  //热更新
});

// 更新html(对编译器有安全检查冲突)
gulp.task('html', function () {
    gulp
        .src('./*.html')   //源
        .pipe(gulp.dest('./'))  // 目标
        .pipe(livereload());  //热更新
});

// 压缩图片
gulp.task('imagemin', function () {
    gulp
        .src('./assets/images/**')   //源
        .pipe(imagemin())                  //处理
        .pipe(gulp.dest('./assets/dist/images/'))  // 目标
});

//开启web服务器
gulp.task('webserver', function() {
    //动态获取本地IP地址并使用，便于移动端调试
    let os=require('os');
    let ifaces=os.networkInterfaces();
    for (let dev in ifaces) {
        ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
                if(details.address !== '127.0.0.1'){
                    gulp.src( './' )               // 服务器目录（./代表根目录）
                        .pipe(webserver({         // 运行gulp-webserver
                            livereload: true,     // 启用LiveReload
                            open: true,           // 服务器启动时自动打开网页
                            host:details.address,
                            port:443
                        }));
                    console.log('开启热更新服务器...')
                }
            }
        });
    }
});


/*
* 观察者：
*/
gulp.task('mywatch', function() {
    //监听热跟新
    livereload.listen();
    gulp.watch("./assets/scripts/js/*.js",["uglify"]);  //观察js的变动  变动的话就执行压缩任务
    gulp.watch("./assets/styles/less/*.less",["less"]);  //观察less
    gulp.watch("./assets/styles/css/*.css",["cleanCss"]);  //观察css
});

gulp.task("default",["uglify","webserver","less","cleanCss"]);