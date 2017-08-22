/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 12:22:16 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-08-22 14:14:31
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import host from 'gome-utils-host'
import http from 'gome-utils-http'
import query from 'gome-utils-query'
import eventbus from 'gome-utils-eventbus';
import {Button,Toast,Page, Modal} from 'gome-ui-kit';


import $address from './modules/address.js';
import $pay from './modules/pay.js'
import $addressSelector from '../widgets/addressSelector/stores/addressSelector.js';
import $productList from './modules/productList.js';
import $msgbox from './modules/msgbox.js';
import $outgoods from './modules/outgoods.js';
import $payPassword from './modules/payPassword.js';
import $setPassword from './modules/setPassword.js';
import $giveaway from './modules/giveaway.js';
import $freight from './modules/freight.js';

import islogin from '../utils/islogin.js';
export default new Vuex.Store({
    state: {
        //data: window.sourceData || null,
        data:'',
        recommendMsg:'', //推荐号
        ischeckRefereeNo:'', //是否选择推荐号
        isfirst:true,
        payPassword:'', //支付密码
        latitude:'',//地理定位纬度
        longitude:''//地理定位经度
    },
    mutations: {
        update (state, newData) {
            state.data = newData;
            
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
        $giveaway,
        $freight,
        
    },
    actions: {
        maima ({ dispatch, commit }) {
            try{
                    /*埋码*/
                    var omniture_str=document.getElementById("goods_name_val");
                    var omniture_str_order = document.getElementById("order_name_val");
                    var tmpstr = "";
                    var skutype ='普通';
                    if(window.sourceData.logisticsGoodsInfo && window.sourceData.logisticsGoodsInfo.goodsList){
                        for(var i=0;i < window.sourceData.logisticsGoodsInfo.goodsList.length;i++){
                            
                            tmpstr += ";"+window.sourceData.logisticsGoodsInfo.goodsList[i].goodsNo+";;;;eVar33=|eVar22=|eVar50=普通," ;
                            omniture_str_order.value += ";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].goodsNo + ";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].goodsCount+";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].totalPrice + ","
                        
                        }
                    }
                    
                    if(window.sourceData.pickupGoodsInfo && window.sourceData.pickupGoodsInfo.goodsList){
                        var pickupGoodsInfo = window.sourceData.pickupGoodsInfo;
                        var pickupGoods = pickupGoodsInfo.goodsList;
                        for(var i=0;i < pickupGoods.length;i++){
                            tmpstr += ";"+pickupGoods[i].goodsNo+";;;;eVar33=|eVar22=|eVar50=普通," ;
                            omniture_str_order.value += ";"+ pickupGoods[i].goodsNo + ";"+ pickupGoods[i].goodsCount+";"+ pickupGoods[i].totalPrice + ","
                            
                        }
                    }
                    omniture_str.value = tmpstr;
                    var doSCode = function(){
                        var omniture_goods_str = "";
                        s.products = omniture_str.value;
                        s.events = "scCheckout";
                        s.pageName    = "购物车流程:提交订单";
                        s.channel     = "购物车流程";
                        s.prop1       = "购物车流程:提交订单";
                        s.prop2       = "购物车流程:提交订单";
                        s.prop3       = "购物车流程:提交订单:首页";
                        s.prop4       = "购物流程:提交订单";
                        s_code = s.t();
                    }
                if(document.querySelector('#maima')){
                        doSCode();
                }else{
                        var newScript = document.createElement('script');
                        newScript.id="maima";
                        newScript.src = '//js.gomein.net.cn/plus/js/public/omniture/s_code.js?v=20160908';
                        document.body.appendChild(newScript);
                        newScript.onload = doSCode;
                }
            }catch(e){
                //do nothing
            }
        },
        async updateEntryData({ dispatch, state, commit}){ 
            /*订单接口v3接口*/
            try {
                const data = await http({
                    url: '//' + location.host +'/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'mobileCheckoutDetailV3',
                        json: JSON.stringify({
                            businessType: query.parse(window.location.search).source || 1,
                        })
                    },

                })
                //.then(islogin)
                if(data.isSuccess == 'Y'){
                        window.sourceData = data;
                        
                        dispatch('maima')
                        //this.maima();
                        commit('update',data)
                        
                        dispatch('initAddress',data);
                        //this.initAddress(data);
                        if(data.successMessage){  //新用户没有收货地址，提示框
                            new Modal({
                                data:{
                                    title: '提示',
                                    content: data.successMessage,
                                    hasClose: false,
                                    ok:'我知道了',
                                    classname: 'emptyAddressMsgbox'
                                },
                           
                            })
                        }
                        /*判断页面是否是第一次进来，第一次进来不弹框*/
                        // if(this.$store.state.isfirst){
                        //     commit('alreadyentered', data);
                        //     return;
                        // }
                        dispatch('outOfStock',data)
                        //this.outOfStock(data);
                        
                    }else{
                        if(data.failCode == '0010010070'){
                            new Modal({
                                data:{
                                    title: '',
                                    content: '您已提交过一次，请勿重复提交，您可以在查看订单中继续支付',
                                    hasClose: false,
                                    ok:'查看订单',
                                    cancel:'返回购物车',
                                    classname: ''
                                },
                                created () {
                                    this.$on('cancel', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host +"/shopping_cart.html";
                                       
                                    })
                                    this.$on('ok', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host.replace('cart.','u.') +"/my_order.html";
                                    })
                                    
                                }
                            })
                        }
                        
                    }
            }catch(e){
                
            }	
                
				
        },
        outOfStock ({ dispatch, commit },data) {
                
            if(data.isShowOutOfStock){ //是否提示无货商品信息	 N :无缺货，0 :线下缺货 1：普通商品缺货 2:门店无货
                //是否显示无货提示信息
                var _this = this;
                if(data.isShowOutOfStock=='0' && data.outOfStockList.length>0){
                    /*组成一个新的数组传到弹出框中*/
                        _this.outlistNewarry=[];
                    /*将缺货商品commerceItemID和全部商品commerceItemID做对比，符合的将添加到新数组中，弹出线下缺货弹层*/
                    data.outOfStockList.map( (item, index) => {
                        _this.outOfStockcommerceItemID = item;
                        data.logisticsGoodsInfo.goodsList.map( (goosListItem, index) => {
                            _this.goodsListcommerceItemID = goosListItem.commerceItemID;
                            if(_this.outOfStockcommerceItemID == _this.goodsListcommerceItemID){
                                _this.outlistNewarry.push(goosListItem);
                            }
                            commit('updateoutOfStockdata', _this.outlistNewarry);
                            //this.$store.state.$outgoods.isModalShow = true;
                        })
                    })
                }else if(data.isShowOutOfStock=='2'){
                    /*门店缺货弹层*/
                    // new Modal({
                    //     data:{
                    //         title: '',
                    //         content: data.outOfStockMes,
                    //         hasClose: false,
                    //         ok:'配送到家',
                    //         cancel:'修改门店',
                    //         classname: ''
                    //     },
                    //     created () {
                    //         this.$on('cancel', () => {
                    //             this.close();
                    //             _this.$router.push('/storeAddress');
                    //         })
                    //         this.$on('ok', () => {
                                
                    //             /*请求取消门店*/
                    //             http({
                    //                 url: '//' + location.host + '/order_ajax.html',
                    //                 type:'post',
                    //                 data: {
                    //                     act: 'selectStorePickUp',
                    //                     json: JSON.stringify({
                    //                         businessType: query.parse(window.location.search).source || 1,
                    //                         operationType: 1,  //操作类型 0 :勾选 1：取消
                    //                         storeAddressId: data.storeAddress.addressId //门店id
                    //                     })
                    //                 }
                    //             })
                    //             .then(data => {
                    //                 if(data.isSuccess == 'Y'){
                    //                     eventbus.emit('updateEntryData')
                    //                 }else{
                    //                     new Toast(data.failReason);
                    //                 }
                    //             })
                    //         })
                    //     }
                    // })
                }
                        
            }
        },
        initAddress ({ dispatch, commit },data) {
           
                if(data.address){
                    Vue.nextTick(() => {
                        commit('addressSelector/setAddressCode', { //地址
                            province_id: data.address.provinceId,
                            city_id: data.address.cityId,
                            district_id: data.address.districtId,
                            town_id: data.address.townId,
                        })
                        commit('addressSelector/setCurrentArea', [
                            {
                                name: data.address.provinceName,
                                code: data.address.provinceId,
                            },
                            {
                                name: data.address.cityName,
                                code: data.address.cityId,
                            },
                            {
                                name: data.address.districtName,
                                code: data.address.districtId,
                            },
                            {
                                name: data.address.townName,
                                code: data.address.townId,
                            }
                        ]);
                    })
                }
            },
    }
});
