/*
 * @Author: zhaoye 
 * @Date: 2017-07-03 16:28:57 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-23 21:11:31
 */
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
