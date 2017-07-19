/*
 * @Author: zhaoye 
 * @Date: 2017-07-04 19:22:03 
 * @Last Modified by:   zhaoye 
 * @Last Modified time: 2017-07-04 19:22:03 
 */

const NpmImportPlugin = require("less-plugin-npm-import")
const LessPluginAutoPrefix = require('less-plugin-autoprefix')
const ListsPlugin = require('less-plugin-lists')
const FunctionsPlugin = require('less-plugin-functions')
    
const npmImportPlugin = new NpmImportPlugin({prefix: '~'})
const autoprefixPlugin = new LessPluginAutoPrefix({
    browsers: ["iOS >= 7", 'Chrome >= 46' , 'Firefox >= 41', 'Android > 4.1'],
    flexbox: true
})
const listsPlugin = new ListsPlugin()
const functionsPlugin = new FunctionsPlugin()

const Lesshint = require('lesshint').Lesshint
const lesshint = new Lesshint()
lesshint.configure()

const plugins = [autoprefixPlugin, npmImportPlugin, listsPlugin, functionsPlugin]

module.exports = plugins