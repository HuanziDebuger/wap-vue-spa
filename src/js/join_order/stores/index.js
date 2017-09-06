/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 17:04:48 
 * @Last Modified by: liuhuan
 * @Last Modified time: 2017-09-06 17:24:41
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import http from 'gome-utils-http'

export default new Vuex.Store({
    state: {
        globalState: null,
        goodsList: [],
        curPage: 0,
        filterCatList:[],
        nextCatagoryId: '',
        nextSort: window.sort,
        totalPage:''
    },
    mutations: {
        syncCatagoryState(state, data) {
            state.globalState = data
        },
        syncGoodsListState(state, data) {
            data.map(item => {
                state.goodsList.push(item)
            })
        },
        syncCatagory(state, data) {
            if (data && data.length > 0)
                state.filterCatList = data
        },
        //获取商品的总页数
        getTotalPage(state,page){
            state.totalPage = page
        },
        backPage(state) {
            state.curPage--
        },
        nextPage(state) {
            state.curPage++
        },
        resetPage(state) {
            state.curPage = 0
            state.goodsList = []
            state.nextSort = 0
        },
        setNextCatagoryId(state, id) {
            state.nextCatagoryId = id
        },
        setNextSort(state, sort) {
            state.nextSort = sort
        }
    },
    actions: {
        async sendGiftGoods({ stat, commit }, options) {
            //点击确定发起的请求
            try {
                const result = await http({
                    url: `//${location.host}/shop_cart/joinOrderAdd`,
                    type: 'post',
                    data: {
                        sourse: window.sourse,
                        isNpop: window.isNpop,
                        promId: window.promId,
                        isGetGifts: window.isGetGifts,
                        goodsList: options,
                        shopNo:window.shopNo||"",
                        relCommIds:window.relCommIds||""
                    }
                })
                if (result.isSuccess == 'N') {
                    return Promise.reject(new Error(result.failReason))
                }
                commit('syncCatagoryState', result)
                return result

            } catch (e) {
                return Promise.reject(e)
            }
        },
        async syncCatagoryState({ state, commit }) {
            try {
                const result = await http({
                    url: `//${location.host}/shop_cart/joinOrderAdd`,
                    type: 'post',
                    data: {
                        sourse: window.sourse,
                        isNpop: window.isNpop,
                        promId: window.promId,
                        isGetGifts: window.isGetGifts,
                        shopNo:window.shopNo||"",
                        relCommIds:window.relCommIds||""
                        
                    },
                })
                if (result.isSuccess == 'N') {
                    return Promise.reject(new Error(result.failReason))
                }
                commit('syncCatagoryState', result)
                return result
            } catch (e) {
                return Promise.reject(e)
            }
        },
        async getProductList({ state, commit }, options) {            
            if (!options) {
                options = {
                    reset: false
                }
            }
            try {
                if (options.reset) {
                    commit('resetPage')
                } else {
                    commit('nextPage')
                }
                commit('setNextSort', options.sort || 0)
                if (options.catId) {
                    commit('setNextCatagoryId', options.catId)
                }                
                const result = await http({
                    url: `//${location.host}/shop_cart/joinOrderList`,
                    data: {
                        act_id:window.act_id,
                        sort: state.nextSort,
                        page: state.curPage,
                        crossShop:  window.crossShop,
                        sourse: window.sourse,
                        isKdpPromotion: window.isKdpPromotion,
                        promId: window.promId,
                        cat_id: state.nextCatagoryId,
                    },
                    isNeedLoading: 'N',
                })
                if (result.isSuccess == 'N') {
                    commit('backPage')
                    return Promise.reject(new Error(result.failReason))
                }
                commit('syncCatagory', result.filterCatList)
                commit('syncGoodsListState', result.goodsList)
                //获取接口返回的分页信息
                commit('getTotalPage',result.pageBar.totalPage)
                return result
            } catch (e) {
                commit('backPage')
                return Promise.reject(e)
            }
        },
        async addProductToCart({ state, commit }, { goodsNo, skuID }) {
            try {
                const result = await http({
                    url: `//${location.host}/shop_cart/joinOrderAdd`,
                    type: 'post',
                    data: {
                        sourse: window.sourse,
                        promId: window.promId,
                        isNpop: window.isNpop,
                        goodsList: [{
                            productId: goodsNo,
                            skuId: skuID,
                            number: 1
                        }],
                        shopNo:window.shopNo||"",
                        relCommIds:window.relCommIds||""
                    },
                    isNeedLoading: 'Y',
                })
                if (result.isSuccess == 'N') {
                    return Promise.reject(new Error(result.failReason))
                }
                commit('syncCatagoryState', result)
                return result
            } catch (e) {
                return Promise.reject(e)
            }

        }
    },
})