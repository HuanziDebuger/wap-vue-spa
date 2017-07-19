/*
 * @Author: zhudanmei 
 * @Date: 2017-02-15 14:20:33 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-08 18:36:34
 */
import Vue from 'vue';
export default {
    state: {
        data: null,
        isModalShow:false, //控制弹框显隐
    },
    mutations: {
        updategiveawaydata(state, newData) {
            state.data = newData;
           
        }
    },
};