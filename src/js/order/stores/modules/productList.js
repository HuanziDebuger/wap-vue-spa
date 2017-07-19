/*
 * @Author: zhaoye 
 * @Date: 2017-02-04 16:04:21 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-09 11:24:22
 */

import Vue from 'vue';
export default {
    state: {
        data: null,
        shippingMethod:{},
        shippingArray:[],
        g3ppDeliveryType:'',
        fixedTime:'',
        userDeliveryTimeslot:''
    },
    getters: {
        getProductListData (state) {
            return state.data
        },
        getCurrentDeliverTimeOption (state) {
            if(state.data.deliverTimeOptions){
                return state.data.deliverTimeOptions.filter(item => {
                    if(item.selected == 'Y'){
                        return true;
                    }else return false;
                })[0]
            }else{
                return state.data.g3ppDeliverTimeOptions.filter(item => {
                    if(item.selected == 'Y'){
                        return true;
                    }else return false;
                })[0]
            }
            
        },
    },
    mutations: {
        updateProductList (state, newData) {
            
            state.data = newData;
        }
    },
};