/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 13:14:39 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-08 18:36:44
 */
import Vue from 'vue';
export default {
  state: {
      data: null
  },
  mutations: {
      updatePay (state, newData) {
          
          state.data = newData;
      }
  },
};
