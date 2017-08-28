module.exports = {
    path: __dirname + '/src/js',
    entries: [
        //'demo/index.js',
        //'order/index.js',
        'join_order/index.js'
    ],
    legacy: {
        views: [
            // 'demo/legacy/**/*'
            'join_order/join_order.ejs'
        ],
        style: [
            // 'demo/legacy/**/*'
        ],
        js: [
            // 'demo/legacy/**/*'
        ],
        images: []
    }
}