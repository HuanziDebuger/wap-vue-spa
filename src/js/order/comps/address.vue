/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 12:30:39 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 20:02:37
 */
<template>
    <!--地址模块-->
    <page>
        <navigator>选择地址</navigator>
        <div class="address-wrapper" v-if="showAddressList">
            <!--<addAddress></addAddress>-->
            <addressList></addressList>
        </div>
    </page>
</template>
<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex'
    import {Page} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query'
    import Nav from '../widgets/nav/nav.vue';
    import AddressList from './address/addressList.vue';
    import islogin from '../utils/islogin.js';
    export default Vue.extend({
        components: {
            page: Page,
            addressList: AddressList,
            navigator: Nav
        },
        
        data () {
            return {
                showAddressList: false
            }
        },
        created () {
            http({
                url: '//' + location.host + '/order_ajax.html',
                type:'post',
                data: {
                    act: 'addressList',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || 1,
                    })
                }
            })
            .then(islogin)
            .then(function(data){
                
                this.$store.commit('updateAddress', data)
                
                if(this.$store.state.$address.data){
                    this.showAddressList = true;
                }
            }.bind(this))
        },
        methods:{
            
        }

    });
</script>
<style lang="less">
@import '../less/order.less';

</style>

