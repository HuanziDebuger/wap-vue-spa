/*
 * @Author: zhudanmei 
 * @Date: 2017-08-02 16:13:35 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-08-07 14:55:34
 */

import Vue from 'vue';
import Vuex from 'vuex'
import $g from 'gome-bridge'
import host from 'gome-utils-host'
import http from 'gome-utils-http'
import query from 'gome-utils-query'
import env from 'gome-utils-env'

Vue.use(Vuex);
export default {
    state: {
        data: '',
    },
    mutations: {
        freightDetails(state, newData) {
            state.data = newData;
        }
    },
    actions: {
        async freight({state, commit}){  //运费接口
           
            const data = await http({
                url: '//' + location.host + '/order_ajax.html',
                type: 'post',
                data: {
                    act: 'freightDetails',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || '1',
                        
                    })
                    
                },
        
                isNeedLoading: 'Y'
            })
            .then(data => {
                commit('freightDetails',data)
            })
             
            
                
            
        },
    }
};

