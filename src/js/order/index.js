/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 12:30:57 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 14:05:32
 */

// import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from "vue-router";
// Vue.use(VueRouter);
import {Gotop,Toast,Modal,Root,CImage,Tag} from 'gome-ui-kit';

Vue.use(Modal);
/*import {lazyload} from 'gome-ui-lazyload';*/

import Entry from './comps/entry.vue';
import Invoice from './comps/invoice.vue';
import Address from './comps/address.vue';
import StoreAddress from './comps/storeAddress.vue';
import EditAddress from './comps/editAddress.vue';
import Pay from './comps/pay.vue';
//import Sendway from './comps/sendWay.vue';
import ProductList from './comps/productList.vue';
import PickUpProductList from './comps/pickupProductList.vue';
import AddressSelector from './widgets/addressSelector/addressSelector.vue';

import store from './stores/index.js';

import $g from 'gome-bridge'
$g.ready(() => {
    $g.setTitle('填写订单页')
    $g.setShareInfo({link:'',title:'',imageUrl:'',shareDesc:''})
})

const router = new VueRouter({
  routes: [
      {
        path: '/',
        component: Entry,
      },
      {
         path: '/productList',
         component: ProductList
      },
      {
         path: '/pickupProductList',
         component: PickUpProductList
      },
      {
        path: '/address',
        component: Address,
      },
      {
        path: '/address/add',
        component: EditAddress,
        children: [
            {
                path: 'addressSelector',
                component: AddressSelector,
            }
        ]
      },
      {
        path: '/address/edit/:id',
        component: EditAddress,
        children: [
            {
                path: 'addressSelector',
                component: AddressSelector,
            }
        ]
      },
      {
          path: '/storeAddress',
          component: StoreAddress,
          children: [
            {
                path: 'addressSelector',
                component: AddressSelector,
            }
          ]
      },
      {
        path: '/pay',
        component: Pay,
      },
      {
        path: '/pay/store',
       // component: Store,
      },
    //   {
    //     path: '/sendWay',
    //     component : Sendway,
    //   },
      {
        path: '/invoice',
        component : Invoice,
        children: [
            {
                path: 'addressSelector',
                component: AddressSelector,
            }
        ]
      }
  ],

});

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。

/*new App({
    el: '#app',
    data:function(){
        return {
            a:false,
        }
    },
    created:function(){

    },
});*/
const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(Root)
})
// import test from './test.vue'
// const app = new Vue({
//     el: '#app',
//     store,
// 	render: h => h(test)
// })


import eb from 'gome-utils-eventbus'


const gotop = new Gotop();
