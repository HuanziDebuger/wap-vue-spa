/*
 * @Author: zhaoye 
 * @Date: 2017-04-17 16:42:10 
 * @Last Modified by:   zhaoye 
 * @Last Modified time: 2017-04-17 16:42:10 
 */
const CacheFile = require('./CacheFile.js')

const cacheMap = {}

function setCache(filepath, contents){
    cacheMap[filepath].payload = contents
}

function shouldCache(filepath){
    if(!cacheMap[filepath]){
        cacheMap[filepath] = new CacheFile(filepath)
        return true
    }
    if(cacheMap[filepath].tryChangeSig()){
        return true
    }else{
        return false
    }
}

function getCache (filepath){
    return cacheMap[filepath].payload
} 

module.exports = {
    shouldCache,
    setCache,
    getCache
}