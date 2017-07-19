/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 13:14:39 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-04-05 17:51:35
 */
import Vue from 'vue';
export default {
  state: {
      data: null
  },
  mutations: {
      updateAddress (state, newData) {
          console.log(newData);
          state.data = newData
      }
  },
};
