/*
 * @Author: zhaoye 
 * @Date: 2017-01-16 17:20:24 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-04-21 16:23:37

 */
import Vue from 'vue';
import eventbus from 'gome-utils-eventbus'
export default {
    state: {
        data: null,
        index: 3,
        level: 4,
        //这个是经过接口确认的选中的地址
        currentArea: [{name:''},{name:''},{name:''},{name:''}],
        addr_type: 0,
        lock: 0,
        //这个是当前选择的地址
        addressCode:{},
    },
    getters: {
        ['addressSelector/getLock'] (state) {
            return state.lock
        },
        ['addressSelector/getType'] (state) {
            return state.addr_type
            
        },
        ['addressSelector/getData'] (state) {
            return state.data
        },
        ['addressSelector/getIndex']  (state) {
            return state.index
        },
        ['addressSelector/getLevel']  (state) {
            return state.level
        },
        ['addressSelector/getCurrentArea']  (state) {

            return state.currentArea
        },
        ['addressSelector/getAddressCode']  (state) {
            return state.addressCode
        },
        ['addressSelector/getAddress']  (state) {
            const address = {};
            const levels = state.data.levels.match(/\d/) ? state.level : state.data.levels
            for(let i = 1; i <= levels; i++){
                const areaLv = state.data['areaLv' + i]
                let hasCurrent = false;
                for(let j = 0; j < areaLv.length; j++){
                    if(areaLv[j].current){
                        hasCurrent = true;
                        address['areaLv' + i] = areaLv[j];
                    }
                }
                if(!hasCurrent) {
                    return false
                }
            }
            return address
        },
    },
    mutations: {
        setIndex (state, idx) {
            state.index = idx;
        },
        setLevel (state, level) {
            state.level = level;
        },
        setLock (state, lock) {
            state.lock = lock;
        },
        setAddressType (state, type) {
            if(type == 'store' || type == 4){
                state.addr_type = 4;
            }else{
                state.addr_type = 0;
            }
        },
        ['addressSelector/setAddressCode'] (state, newAddressCode) {

            state.addressCode = newAddressCode
        },
        ['addressSelector/setCurrentArea'] (state, area) {
            for(var i=0; i<4; i++){
                if(!state.currentArea[i]){
                    state.currentArea[i] = {}
                }
            }
            state.currentArea[0].name = area[0].name
            state.currentArea[1].name = area[1].name
            state.currentArea[2].name = area[2].name
            state.currentArea[3].name = area[3].name

            state.currentArea[0].code = area[0].code
            state.currentArea[1].code = area[1].code
            state.currentArea[2].code = area[2].code
            state.currentArea[3].code = area[3].code
        },
        updateAddressSelector (state, newData) {
            console.log()
            //state.data = newData;
            if(!state.data)state.data = {}
            for(var key in newData.data){
                Vue.set(state.data, key, newData.data[key])
            }
            //设置上一级
            if(newData.idx >= 0){
                const level = !newData.data ? state.level : (Number(newData.data.levels) - 1);
                state.data['areaLv' + level].forEach((item, index) => {
                    item.current = false;
                    if(index == newData.idx){
                        item.current = true;
                    }
                })
            }
            //重设tab
            state.currentArea = [];
            const levels = state.data.levels.match(/\d/) ? state.level : state.data.levels
            for(let i = 1; i <= levels; i++){
                const areaLv = state.data['areaLv' + i];
                let hasCurrent = false;
                for(let j = 0; j < areaLv.length; j++){
                    if(areaLv[j].current){
                        hasCurrent = true;
                        state.currentArea.push(areaLv[j]);
                    }
                }
                if(!hasCurrent) {
                    state.currentArea.push({name:'请选择'})
                    return
                }
            }
        },
        scrollTo (state, newData) {
            if(newData >= state.level){
                //state.index = 0;
                eventbus.emit('addressSelector.exit')
            }else{
                state.index = newData
                eventbus.emit('addressSelector.next')
            }
        },
    }
};