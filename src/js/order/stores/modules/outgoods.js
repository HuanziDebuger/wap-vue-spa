/*
 * @Author: zhudanmei 
 * @Date: 2017-02-16 18:04:26 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-02-18 15:08:40
 */
import Vue from 'vue';
export default {
    state: {
        data: null,
        isModalShow:false, //控制弹框显隐
    },
    mutations: {
        updateoutOfStockdata(state, newData) {
            state.data = newData;
            
        }
    },
};