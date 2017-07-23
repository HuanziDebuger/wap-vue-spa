/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 12:22:16 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-23 21:10:59
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import $address from './modules/address.js';
import $pay from './modules/pay.js'
import $addressSelector from '../widgets/addressSelector/stores/addressSelector.js';
import $productList from './modules/productList.js';
import $msgbox from './modules/msgbox.js';
import $outgoods from './modules/outgoods.js';
import $payPassword from './modules/payPassword.js';
import $setPassword from './modules/setPassword.js';
import $giveaway from './modules/giveaway.js';
export default new Vuex.Store({
  state: {
      data: window.sourceData || null,
      recommendMsg:'', //推荐号
      ischeckRefereeNo:'', //是否选择推荐号
      isfirst:true,
      payPassword:'', //支付密码
      latitude:'',//地理定位纬度
      longitude:''//地理定位经度
  },
  mutations: {
      update (state, newData) {
          state.data = newData
      },
      updateStore (state, newData) {
          if(!state.data.storeAddress){
              state.data.storeAddress = {}
          }
          for(var key in newData){
              state.data.storeAddress[key] = newData[key]
          }
      },
      alreadyentered(state, newData){  //已经进入
          state.isfirst = false
      }
  },
  modules: {
      $address,
      $pay,
      $addressSelector,
      $productList,
      $msgbox,
      $outgoods,
      $payPassword,
      $setPassword,
      $giveaway
  }
});
