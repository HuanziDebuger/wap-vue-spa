
const crequire = require('crequire')
const fs = require('fs')
const path = require('path')

const cwd = path.join(__dirname , '../..')
const Edge = require('./ListGraph/Edge.js')
const Vertex = require('./ListGraph/Vertex.js')


const aliasPath = {}

module.exports = function(filepath){
    const depsTree = {}
    let depIdx = 0
    //顶点表
    const vertexList = []

    function getLastLinkNode (node) {
        if(!node.next)return node
        return getLastLinkNode(node.next)
    }

    //已经访问过的文件的set，防止重复访问
    const visitedFileList = {}
    let fileCnt = 0;


    //排序栈 
    const stack = [];

    //排好序的队列
    const queue = [];

    function parse (filepath, base, isEntry) {
        let contents = fs.readFileSync(filepath,'utf-8')
        //加入了入口的判断，主要是为了，自动插入polyfill
        if(isEntry){
            contents = require('../prePolyfill.js')+contents;
        }
        const deps = crequire(contents)
        if(!visitedFileList[filepath]){
            visitedFileList[filepath] = fileCnt
            fileCnt++
            deps.forEach((dep, index) => {
                let _filepath
                //相对路径咯
                if(dep.path.match(/^\./)){
                    if(dep.path.match(/\.js$/)){
                        _filepath = path.resolve(path.dirname(filepath), dep.path)
                    }else{
                        var nodeModule = ''
                        if(dep.path.match(/node_modules/)){
                            nodeModule = 'node_modules/'
                        }
                        if(fs.existsSync(path.resolve(path.dirname(filepath), dep.path+'.js'))){
                            _filepath = path.resolve(path.dirname(filepath), dep.path+'.js')
                            aliasPath[dep.path] = nodeModule + dep.path + '.js'
                        }else{
                            _filepath = path.resolve(path.dirname(filepath), dep.path, 'index.js')
                            aliasPath[dep.path] = nodeModule + dep.path + '/index.js'
                        }
                    }
                //node_modules直接引用咯
                }else if(!dep.path.match(/^\./) && dep.path.match(/\.js$/)){
                    _filepath = path.resolve(cwd, 'node_modules', dep.path)
                //node_modules自己从package.json里找入口咯
                }else{
                    var pkgJSONPath = path.resolve(cwd, 'node_modules', dep.path, 'package.json')
                    function getNodeModuleDefault(){
                        if(fs.existsSync(path.resolve(cwd,  'node_modules', dep.path+'.js'))){
                            _filepath = path.resolve(cwd,  'node_modules', dep.path+ '.js')
                            aliasPath[dep.path] = dep.path + '.js'
                        }else{
                            _filepath = path.resolve(cwd,  'node_modules', dep.path, 'index.js')
                            aliasPath[dep.path] = dep.path + '/index.js'
                        }
                    }
                    const pkgJSONExist = fs.existsSync(pkgJSONPath)
                    //console.log(pkgJSONExist)
                    if(pkgJSONExist){
                        const config = JSON.parse(String(fs.readFileSync(pkgJSONPath)))
                        if(config.main){
                            _filepath = path.resolve(cwd, 'node_modules', dep.path, config.main)
                            aliasPath[dep.path] = dep.path + '/' + config.main
                        }else{
                            getNodeModuleDefault()
                        }
                    }else{
                        getNodeModuleDefault()
                    }
                    
                }
                //建立定点表，同时记录每个定点的入度
                // let shouldNew = true
                // for(var key in vertexList){
                //     let vertex = vertexList[key]
                //     if(vertex.data == _filepath){
                //         vertex.inDeg++
                //         vertex.parents.push(visitedFileList[filepath])
                //         shouldNew = false

                //         break;
                //     }
                // }
                // if(shouldNew){
                //     const vertex = new Vertex()
                //     vertex.data = _filepath
                //     vertex.inDeg++
                //     vertexList.push(vertex)
                //     vertex.parents.push(visitedFileList[filepath])
                    
                // }
                //递归
                //console.log(_filepath)
                parse(_filepath, path.dirname(_filepath))
            })
        }
        
    }

    parse(path.resolve(cwd, 'src', filepath.replace(/^\//,'')) 
         ,path.resolve(cwd, 'src')
         ,true)


    /*
    (1) 扫描顶点表，将入度为0的顶点入栈。

    (2) 当栈非空时执行以下操作：

    1.将栈顶顶点vi的序号弹出，并输出之；

    2.检查vi的出边表，将每条出边表邻接点域所对应的顶点的入度域值减1，若该顶点入度为0，则将其入栈；

    (3) 若输出的顶点数小于n，则输出“有回路”，否则拓扑排序正常结束。
    */
    // vertexList.forEach( (item, index) => {
    //     //console.log(item)
    //     if(item.parents.length > 0){
    //         for(var idx in item.parents){
    //             const edge = new Edge()
    //             edge.adjvex = index

    //             var _idx = item.parents[idx]
    //             //console.log(_idx)
    //             //console.log(vertexList[_idx])
    //             //出点
    //             if(!vertexList[_idx].firstEdgeNode)
    //                 vertexList[_idx].firstEdgeNode = edge
    //             else{
    //                 getLastLinkNode(vertexList[_idx].firstEdgeNode).setNext(edge)
    //             }
    //         }
    //     }
    //     if(item.inDeg == 0){
    //         stack.push(item)
    //     }
    // })
    

    // let count = 0
    // const limit = 100
    // const sortResult = []
    // while(stack.length > 0){
    //     const vertex = stack[0]
    //     if(!vertex)break;
    //     stack.shift()
    //     sortResult.push(vertex)
    //     count++
    //     if(count > limit)break;
    //     let edge = vertex.firstEdgeNode
    //     if(edge){
    //         while(edge){
    //             vertexList[edge.adjvex].inDeg -= 1
    //             if(vertexList[edge.adjvex].inDeg == 0){
    //                 stack.push(vertexList[edge.adjvex])
    //             }
    //             edge = edge.next
    //         }
    //     }
    // }
    // for(vertex of vertexList){
    //     if(vertex.inDeg>1 && vertex.firstEdgeNode){
    //         console.log(vertex)
    //         //throw new Error('循环依赖，从 '+vertex.data+' 开始')
    //     }
    // }
    var arr = []
    for(var key in visitedFileList){
        arr.push(key)
    }
    return {
        result: arr.map(item => {return item.replace(path.resolve(cwd,'src'),'').replace(/^.*node_modules/,'node_modules').replace(/\\/g,'/').replace(/^\//,'')}),
        aliasPath
    }
}
