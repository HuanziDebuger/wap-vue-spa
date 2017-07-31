/*
 * @Author: zhaoye 
 * @Date: 2017-07-04 17:02:36 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-27 18:47:45
 */
const express = require('express');
const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv;
const less = require('less')


module.exports = function(router){
    router.get('*.css|*.css.map', (req, res, next) => {
        let filename
        filename = path.resolve(__dirname, '../../src', req.path.replace(/^\//,'').replace('.css', '.less'))
        if(req.url.match(/node_modules/)){
            filename = path.resolve(__dirname, '../../', req.path.replace(/^(.*)node_modules/,'node_modules'))
        }
        if(fs.existsSync(filename)){
            fs.readFile(filename, (err, chunk) => {
                const content = String(chunk)
                //lint
                // const result = lesshint.checkString(content, filename)
                //less
                const options = {
                    filename,
                    // sourceMap: {
                    //     sourceMapRootpath: 'debug:///',
                    //     sourceMapFileInline: true
                    // },
                    plugins: require('../../lib/lessPlugins.js')
                }
                less.render(content, options)
                    .then((result) => {
                        res.append('Content-Type','text/css')
                        res.send(result.css)
                    })
                    .catch( (err) => {
                        //res.end(err.message)
                        next(err)
                       // throw new Error(err)
                    })
            })
        }else{
            next()
        }
    })
}

