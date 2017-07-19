/*
 * @Author: zhaoye 
 * @Date: 2017-07-03 17:28:56 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-06 10:20:15
 */
const app = require('../app.js')
const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv
const ejs = require('ejs')

module.exports = function(router){
    router.get('/*', (req, res, next) => {
        const filename = path.resolve(__dirname, path.join('../../src/views', req.path)).replace(/\.html$/,'.ejs')
        if(fs.existsSync(filename)){
            const tmpl = String(fs.readFileSync(filename))
            const result = tmpl.replace(/\{JS_CDN_IP\}/g, '/js')
                                .replace(/\{CSS_CDN_IP\}/g, '/style')
                                .replace(/\{APP_CDN_IP\}/g, '/images')
                                .replace(/\{GOMEUI_CDN_IP\}/g, '/gomeUI')
            res.end(ejs.render(result, {
                filename
            }))
        }else if(req.path.match(/\.html$/)){
            res.render(req.path.replace(/^\//,''))
        }else{
            next()
        }
    })
}

