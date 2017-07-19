/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 14:32:42 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-27 13:49:24
 */
<template>
    <div>
        <ul v-if="$store.state.$address.data.addressList" class="address-list">
            <li v-for = "(item, index) in $store.state.$address.data.addressList">
                <div class="info" @click="onRadioClick;onSelectedAddress(index)">
                    <radio :source="radioSource" :index="index"></radio>
                    <div class="cont">
                        <h4 class="title">
                            <span class="name">{{item.name}}</span>
                            <span class="tel">{{item.mobile}}</span>
                        </h4>
                        <p class="address"><span class="ui tag" v-if="item.isDefault == 'true'">默认</span>{{combindAddress(item)}}</p>
                    </div>
                    
                </div>
                <div class="menu flexbox">
                    <div class="flex1"></div>
                    <a @click="editAddress(item.id)" class="edit-btn"><i></i>编辑</a>
                </div>
            </li>
        </ul>
        <div class="add-btn">
            <btn @click.native="addAddress" :className='"default red block"'>新增地址</btn>
        </div>
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import {Button, Toast, RadioItem, RadioMixin} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query';
    import islogin from '../../utils/islogin.js';
    export default Vue.extend({
        mixins: [RadioMixin],
        components: {
            btn: Button,
            radio: RadioItem,
        },
        computed: {
            radioSource () {
                return this.$store.state.$address.data.addressList.map((item, index) => {
                    return {
                        isActive: item.id == this.$store.state.$address.data.currentAddress.id ? true : false,
                    }
                })
            },
            data () {
                return this.$store.state.$address.data
            }
        },
        methods:{
            /**
             * 跳转到添加地址
             */
            addAddress () {
                this.$router.push('/address/add')
                http({
                    url: '//' + location.host + '/index.php',
                    data: {

                    }
                })
                .then(function(){
                    
                }.bind(this));
            },
            /**
             * 生成详细地址
             * 
             * @param {json} data
             * @returns
             */
            combindAddress (data) {
                return data.provinceName + data.cityName + data.districtName + data.townName + data.address
            },
            /**
             * 跳转到编辑地址
             * 
             * @param {string} id
             */
            editAddress (id) {
                this.$router.push({path:'/address/edit/' + id});
                /*http({
                    url: '//' + location.host + '/index.php',
                    data: {

                    }
                })
                .then(function(){
                    
                }.bind(this));*/
            },
            /**
             * 
             */
            onSelectedAddress (index) {
                const selectedAddress = this.data.addressList[index];
                http({
                    url: '//' + location.host + '/index.php?ctl=order&act=saveAddress',
                    type: 'post',
                    data: {
                        edit_id:     selectedAddress.id,
                        name:        selectedAddress.name,
                        mobile:      selectedAddress.mobile,
                        province_id: selectedAddress.provinceId,
                        city_id:     selectedAddress.cityId,
                        district_id: selectedAddress.districtId,
                        town_id:     selectedAddress.townId,
                        address:     selectedAddress.address,
                        source:      query.parse(window.location.search).source || '1'
                    }
                })
                .then(islogin)
                .then(data => {
                    if(data.isSuccess == 'Y'){
                        this.$router.back();
                    }else{
                        new Toast(data.failReason)
                    }
                })
            },
        },
    });
</script>
<style lang='less'>
    @import '../../less/order.less';
    .address-wrapper{
        padding-bottom:.82rem;
    }
    .address-list{
        .module_padding();
        .module();
    }
    .address-list li{
        background-color: @white;
        .module();
        .info{
            .boxSizing();
            .flexbox();
            padding: .34rem .2rem .28rem .2rem;
            .border-bot(@gray-dark-border);
            .radio{
                width: .32rem;
                height: .32rem;
                margin-right: .2rem;
                .background-image-nm(url(../../images/radio_no.png));
                &.active {
                    .background-image-nm(url(../../images/radio_yes.png));
                }
            }
            .cont{
                .flexitem(1);
                .title{
                    .flexbox();
                    .flexbox.v_center;
                    line-height: @font-lg-sm - .02rem;
                    font-size: @font-lg-sm - .02rem;
                    .module();
                    color: @gray-dark;
                    .name{
                        .set-ellipsis();
                        margin-right: .1rem;
                    }
                }
                .ui.tag {
                    display: @inlineBlock;
                    .boxSizing();
                    font-size: @font-sm;
                    color: @red;
                    .padding(0.1rem;.03rem; 0.1rem; .03rem);
                    border-radius: .04rem;
                    .border-nm(@red);
                    line-height: 0.05rem;
                    margin-right: 0.03rem;
                }
                .address{
                    line-height: .35rem;
                    font-size: .26rem;
                    color: #888;
                }
            }
            
        }
        .menu {
            .hor_padding();
            color: @gray-light;
            font-size: @font-nm-sm;
            .text-right();
            color: @gray-light;
            .edit-btn{
                .set-line-height(1;.7rem;);

                display: block;
                width: @font-nm-sm * 6;
                i{
                    .set-width-height(1;.24rem;);
                    .background-image-nm(url(../../images/edit_address.png));
                    display: @inlineBlock;
                    vertical-align: middle;
                    margin-right: .1rem;
                }
            }
        }
    }
    .add-btn {
        .fixed-btn();
        z-index: @z-nm;
        
        .btn{
            height:.9rem;
            line-height:.9rem;
            .set-line-height(1;.9rem);
            font-size: @font-lg-sm + .02rem;
        }
    }
</style>