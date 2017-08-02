/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 14:51:14 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-30 01:30:30
 */
import Vue from 'vue'

import App from './comps/entry.vue'
import store from './stores'

import {Toast, ErrorPage} from 'gome-ui-kit'

function entry () {
    new Vue({
        components: {
            App,
        },
        store,
        el: '#app',
        render: h => h(App),
    })
}
async function init () {
    try {
        await store.dispatch('syncCatagoryState')
        entry()
    }catch(e){
        document.querySelector('#pre-loading').style.display = 'none'
        new Toast(e.message)
        new ErrorPage.Default({
            created () {
                this.$on('click', () => {
                    window.location.reload()
                })
            }
        })
    }
}
init()
