/*
 * @Author: zhaoye 
 * @Date: 2017-04-12 13:22:44 
 * @Last Modified by:   zhaoye 
 * @Last Modified time: 2017-04-12 13:22:44 
 */
class Vertex {
    constructor ( ) {
        //定点内容
        this.data
        //入度
        this.inDeg = 0
        //边链表的第一个节点
        this.firstEdge

        this.parents = []
    }
    setData (data) {
        this.data = data
    }
    setfirstEdgeNode (firstEdgeNode) {
        this.firstEdge = firstEdge
    }
}

module.exports = Vertex