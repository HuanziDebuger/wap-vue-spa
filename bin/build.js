/*
 * @Author: zhaoye 
 * @Date: 2017-06-29 13:44:21 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-17 16:32:22
 */
const webpackConfig = require('../webpack.config.js')
const webpack = require('webpack')
const path = require('path')
const getEntries = require('../lib/ls-entries.js')
const gulp = require('gulp')
const entryrc = require('../.entryrc.js')

const rmdir = require('rmdir')

rmdir(path.resolve(__dirname, '../dist'), () => {


//webpack
getEntries()
.then(entries => {
    if (!entries) return
    webpack(webpackConfig({
        entries
    }),(err, stats) => {
    if (err || stats.hasErrors()) {
        // Handle errors here
    }
    // console.log(stats)
    // Done processing
    })
})


//legacy
const less = require('less')
const lessPlugin = require('../lib/lessPlugins.js')
const through = require('through2')

function getRealSrc(srcArr, dir) {
    if(srcArr.length == 0){
        console.log(`no legacy ${dir} entry`)
    }
    return srcArr.map(src => path.resolve(__dirname, `../src/${dir}/${src}`))
}
const ejs = require('ejs')
//ejs
gulp.src(getRealSrc(entryrc.legacy.views, 'views'))
    .pipe(through.obj((file, enc, cb) => {
        //根目录矫正
        file.base = path.join(file.cwd, 'src/views')

        if(file.path.match(/\.ejs$/)){
            const content = String(file.contents)
            const result = ejs.render(content, {
                filename: file.path
            })
            file.path = file.path.replace('.ejs', '.html')
            file.contents = new Buffer(result)
            cb(null, file)
        }else{
            cb(null, file)
        }
    }))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/views')))
    .on('end', () => {

        //style
        gulp.src(getRealSrc(entryrc.legacy.style, 'style'))
            .pipe(through.obj((file, enc, cb) => {
                //根目录矫正
                file.base = path.join(file.cwd, 'src/style')

                //less
                if(file.path.match(/\.less$/)){
                    const content = String(file.contents)
                    less.render(content, {
                        filename: file.path,
                        plugins: lessPlugin
                    }).then(result => {
                        file.contents = new Buffer(result.css)
                        file.path = file.path.replace('.less', '.css')
                        cb(null, file)
                    }).catch(err => {
                        console.log(err)
                    })
                }else{
                    cb(null, file)
                }
            }))
            .pipe(gulp.dest(path.resolve(__dirname, '../dist/style')))

        //js just copy
        gulp.src(getRealSrc(entryrc.legacy.js, 'js'))
            .pipe(through.obj((file, enc, cb) => {
                //根目录矫正
                file.base = path.join(file.cwd, 'src/js')
                cb(null, file)
            }))
            .pipe(gulp.dest(path.resolve(__dirname, '../dist/js')))
    })




})