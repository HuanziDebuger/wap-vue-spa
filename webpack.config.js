/*
 * @Author: zhaoye 
 * @Date: 2017-06-17 19:49:38 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 02:14:50
 */
const Promise = require('bluebird')
const webpack = require('webpack')
const path = Promise.promisifyAll(require('path'))
const fs   = Promise.promisifyAll(require('graceful-fs'))
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const fslist = require('ls-all')
const isProd = process.env.NODE_ENV == 'production'
const loaderConfig = require('./bin/loadersConfig.js')

function webpackConfig ({ entries }) {
    const config  = {
        resolveLoader: {
            moduleExtensions: ["-loader"]
        },
        resolve: {
            alias: {
                 vue: 'vue/dist/vue.runtime.esm.js',
				// 'gome-ui-kit': 'D:\\workspace\\gome-ui-kit\\index.js'
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use:  [
                        {
                            loader: "vue-loader",
                            options: {
                                loaders: {
                                    js: loaderConfig.js,
                                    less: loaderConfig.less,
                                    css: loaderConfig.css
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: loaderConfig.less
                },
                {
                    test: /\.css$/,
                    use: loaderConfig.css
                },
                {
                    test: /\.scss$/,
                    use: loaderConfig.scss
                },
                {
                    test: /\.ejs$|\.html$/, 
                    use: [
                        {
                            loader: 'ejs-loader',
                            loader: 'ejs-compiled-loader'
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    use:  loaderConfig.js,
                },
                {
                    test: /\.(png|jp[e]?g|bmp|gif)$/,
                    use: [
                        {
                            loader: 'url-loader?name=[path]/[name].[ext]?v=[hash]&publicPath=http://localhost:3000/&outputPath=images/&limit=5000'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                 names: [ 'CommonsChunk/bridge','CommonsChunk/utils','CommonsChunk/uiKit']
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-vue-vendor/gomeVueVendor-manifest.json')
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin()
        ]
    }
    //配置入口
    config.entry = {}
    config.entry['CommonsChunk/bridge'] = [
        'gome-bridge',
    ]
    config.entry['CommonsChunk/utils'] = [
        'gome-utils-base64',
        'gome-utils-cookie',
        'gome-utils-env',
        'gome-utils-eventbus',
        'gome-utils-host',
        'gome-utils-http',
        'gome-utils-http-filters',
        'gome-utils-query'
    ]
    config.entry['CommonsChunk/uiKit'] = [
        'gome-ui-kit',
        'gome-ui-lazyload',
    ]
    for(var key in entries){
        config.entry[key.replace(/\.js/,'')] = [entries[key]]
    }
    //配置出口
    config.output = {
        publicPath: '/',
        path: path.resolve(__dirname, `dist`),
        filename: `js/[name].js`,
    }
    config.devtool = 'cheap-module-source-map'
    //区别环境
    if(!isProd){
        config.entry['CommonsChunk/uiKit'].push('./lib/hotReloadEntry.js')
		
        config.plugins.push(new ExtractTextPlugin({
                filename: 'style/[name].css',
                disable: false,
                allChunks: true,
            }))
		config.plugins.push(new OptimizeCssAssetsPlugin({
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: {removeAll: true } },
			canPrint: true
		}))
			
        config.plugins.push(new UglifyJSPlugin({
            sourceMap: true,
            comments: false
        }))
    }else{
        config.plugins.push(new webpack.DefinePlugin({
                'process.env':{
                    NODE_ENV: `${process.env.NODE_ENV}`
                }
            }))
    }
    return config
}
module.exports = webpackConfig