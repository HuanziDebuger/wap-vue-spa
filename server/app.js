/*
 * @Author: zhaoye 
 * @Date: 2017-04-12 13:22:56 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 03:35:43
 */
const express = require('express')
const app = new express
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require("path")
const fs = require('fs')

const webpackEntries = require('../lib/ls-entries.js')
const router = require('./routes/index')

const lessMiddleware = require('less-middleware');


const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config.js')

const fslist = require('ls-all')
const hasha = require('hasha')
// const Server = require('socket.io')
const deep = require('deep-diff')
const del = require('delete')
const mkdirp = require('mkdirp')
 

let manifest = {}
//utils-获取所以文件的md5码，生成manifest
fslist([path.resolve(__dirname, '../src')], {recurse: true, flatten: true})
.then((files) => {
    const start = () => {
        cnt++
        if(cnt == files.length){
            //startServer()
        }
    }
    let cnt = 0
    files.forEach((item) => {
        const isFile = fs.lstatSync(item.path).isFile()
        if(!isFile){
            start()
            return
        }
        hasha.fromFile(path.resolve(__dirname, item.path))
            .then((hash) => {
                manifest[item.path] = hash
                start()
            })
    })
})
.then(() => {
    //startServer()
    return webpackEntries()
})
.then((entries) => {

    app.use(logger('dev', {
       skip: function (req, res) { return res.statusCode < 400 }
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())

    app.set('views', [path.resolve(__dirname, 'views'), path.resolve(__dirname, '../src/views')])
    app.set('view engine', 'ejs')
    app.engine('html', require('ejs').renderFile);
    app.use('/', router)
    
    if(entries){
        const webpackConfigResult = webpackConfig({entries})
        const compiler = webpack(webpackConfigResult)
        app.use(webpackMiddleware(
            compiler
            ,{
					host: 'http://192.168.1.71',
                    quiet: true,
                    // noInfo: true,
                    // watchOptions: {
                    //     aggregateTimeout: 300,
                    //     poll: true
                    // },
                    publicPath: webpackConfigResult.output.publicPath,
                    // reporter: null,
                    // // headers: { "X-Custom-Header": "yes" },
                    stats: {
                        colors: true
                    },
                    // serverSideRender: false,
            }
        ))
        
        app.use(require('webpack-hot-middleware')(compiler))
    }
    
    app.use(express.static(path.resolve(__dirname, '../src')))

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    app.listen(process.argv[2]||'3000', () => {
        console.log('server running on 3000')
    })


})


// function startServer() {
//     //server
//     const io = new Server(8080)
//     io.on('connection', function (socket) {
//         ///初始化同步，增改删
//         socket.on('manifest check', (clientManifest) => {
//             //对比客户端的manifest
//             const differences = deep(manifest, clientManifest)
//             if(!differences)return
//             const files = []
//             differences.map( (diff) => {
//                 if(diff.kind == 'D'){
//                 //删除
//                     const filepath = path.resolve(__dirname, diff.path[0])
//                     deleteFileAndPath(filepath)    
//                 }else{
//                 //通知客户端，提交这个文件的更改
//                     return files.push(diff.path[0])
//                 }
//             })
//             if(files.length == 0)return
//             socket.emit('please sync',files)
//             console.log('init sync')
//             console.log(files)
//         })
//         //增改
//         socket.on('file change', data => {
//             if(!data.filepath)return
//             const dirname = path.dirname(path.resolve(__dirname, data.filepath))
//             const shouldMkdir = !fs.existsSync(dirname)
//             if(shouldMkdir){
//                 console.log('mkdir', dirname)
//                 mkdirp(dirname, () => {
//                     console.log('wirte file', data.filepath)
//                     fs.writeFile(data.filepath, data.buffer)
//                 })
//             }else{
//                 console.log('wirte file', data.filepath)
//                 fs.writeFile(data.filepath, data.buffer)
//             }
//         })
//         //删
//         socket.on('remove file', data => {
//             console.log('remove file', data.filepath)
//             const filepath = path.resolve(__dirname, data.filepath)
//             if(fs.existsSync(filepath)){
//                 deleteFileAndPath(filepath)
//             }
//         })
//     });
// }



//utils-删除
function deleteFileAndPath(filepath){
    del(filepath, {force: true}, () => {
        try {
            fs.rmdirSync(path.dirname(filepath))
        }catch(e){
            //正常，就是强制试着删除一下为空文件夹
        }
    })
}

module.exports = app