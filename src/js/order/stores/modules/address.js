/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 13:14:39 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-23 00:52:00
 */
import Vue from 'vue';
export default {
  state: {
      data: window.addressData || null
  },
  mutations: {
      updateAddress (state, newData) {
          state.data = newData
      }
  },
};
