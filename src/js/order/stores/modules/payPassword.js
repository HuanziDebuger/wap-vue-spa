import Vue from 'vue';
export default {
    state: {
        data: null,
        isModalShow:false, //控制弹框显隐
    },
    mutations: {
        updateoutOfStockdata(state, newData) {
            state.data = newData;
        }
    },
};
