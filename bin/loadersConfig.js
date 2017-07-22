const argv = require('yargs').argv
const isProd = process.env.NODE_ENV == 'production'
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    js: [
        {
            loader: 'babel-loader'
        },
        // {
        //     loader: 'eslint-loader',
        //     options: {
        //         failOnError: true
        //     }
        // }
    ],
    css: !isProd ? ['style-loader', 'css-loader']
                : ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]}),
    less: !isProd ? [{
		loader: 'style-loader',
		// options: {
		// 	singleton: true
		// }
	}, {
		loader:'css-loader',
		options: {
			modules: false,
			camelCase: true,
		}
	}, 'less-loader']
                :  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]}),
    scss: !isProd ? ['style-loader', 'css-loader', 'sass-loader']
                :  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]}),
}
