/*
 * @Author: zhudanmei 
 * @Date: 2017-02-23 18:24:41 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-02-23 21:00:16
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

