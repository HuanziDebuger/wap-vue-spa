/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 12:30:43 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-04-12 15:50:27
 */
<template>
    <!--自提地址模块-->
        <div class="address-module store" :class="{'active': pickUpSource[0] && pickUpSource[0].isActive}" v-if="$store.state.data.isSupportGomeStore=='Y' && $store.state.data.address">
            <!--<div>
                <coption @click.native="onClick" v-for="(item, index) in pickUpSource" :source="pickUpSource" :index="index" @onClick="onOptionClick" >
                    <span slot="pre">门店自提</span>
                </coption>
            </div>-->
            <div class="mark-content">
                <div class="mark-tag"><span class="tag" :class="{'disabled': pickUpSource[0] && pickUpSource[0].isActive== false}">门店自提</span></div>
                
                <coption @click.native="onClick" v-for="(item, index) in pickUpSource" :source="pickUpSource" :index="index" @onClick="onOptionClick" v-if="$store.state.data.storeAddress && $store.state.data.isShowOutOfStock!='2'">
                    <span slot="pre">{{pickupText}}</span>
                </coption>
                
            </div>
            <router-link to="/storeAddress">
                <div class="address-cont">
                    <div v-if="$store.state.data.storeAddress" class="info">
                        <h4>
                            <span class="name" >{{$store.state.data.address.name}}</span>
                            <span class="tel">{{$store.state.data.address.mobile }}</span>
                        </h4>
                        <p class="address-desc" :storeId = '$store.state.data.storeAddress.storeId'>{{$store.state.data.storeAddress.storeName+','+$store.state.data.storeAddress.address+',电话:'+$store.state.data.storeAddress.storePhone}}</p>
                    </div>
                    <div v-else class="mid" ><em>{{$store.state.data.addressPromt}}</em><span>选择门店</span></div>
                    <i class="link-ico"></i>
                </div>
            </router-link>
            
            <!--<p class="no-prompt" v-if="$store.state.data.outOfStockMes">{{$store.state.data.outOfStockMes}}</p>-->
        </div>
        
    
</template>
<script>
    import Vue from 'vue';
    import {Root,OptionItem, OptionMixin,Toast} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query';
    import eventbus from 'gome-utils-eventbus'
    import islogin from '../../utils/islogin.js';
    export default Vue.extend({
        mixins: [OptionMixin],
        components: {
            'coption': OptionItem,
        },
       data () {
            return {
                pickUpSource:[{
                    isActive:false,
                }],
                recommendMsg:'',
                operationType:'',
                storeAddressId: '',//门店id
                pickupText:'我要自提'//自提文案变量
            }
        },
        created () {
            this.init();
            this.$store.subscribe((mutations, state) => {
                if(mutations.type == 'update'){
                    this.init();
                }
            })
        },
        computed: {
            nextPage () {
                if(this.$store.state.data.address){
                    return '/storeAddress' 
                }else{
                    return '/address/add' 
                }
            }
        },
        methods: {
            init (){
                if(this.$store.state.data.storeAddress){
                    this.storeAddressId =  this.$store.state.data.storeAddress.addressId;//门店id
                    this.pickUpSource = [{isActive : this.$store.state.data.storeAddress.isSelected == 'Y' ? true : false,}]
                    if(this.$store.state.data.storeAddress.isSelected== 'Y'){
                        this.pickupText ='取消自提';
                    }else{
                         this.pickupText ='我要自提';
                    }
                    
                }
                
            },
            onClick () {
                if(this.pickUpSource[0].isActive){
                    this.operationType = 0;
                    this.pickupText ='我要自提';
                }else{
                    this.operationType = 1;
                    this.pickupText ='取消自提';
                }
                if(this.$store.state.data.storeAddress){
                    http({
                        url: '//' + location.host + '/order_ajax.html',
                        type:'post',
                        data: {
                            act: 'selectStorePickUp',
                            json: JSON.stringify({
                                businessType: query.parse(window.location.search).source || 1,
                                operationType: String(this.operationType),
                                storeAddressId: this.storeAddressId //门店id
                            })
                        }
                    })
                    .then(islogin)
                    .then(data => {
                        if(data.isSuccess == 'Y'){
                        eventbus.emit('updateEntryData');
                        }else{
                            new Toast(data.failReason);
                        }
                        
                    })
                }else{
                    this.$router.push('/storeAddress');
                }
                
                
            },
        },
    });
</script>

<style lang='less'>
    @import '../../less/order.less';
    .address-module.store {
        color: @gray-light;
        .address-cont{
            .border-bot(@gray-dark-border);
        }
        .mark-content{
            padding: .1rem .2rem .16rem .2rem;
        }
        .option {
            font-size: @font-dark;
            margin-top: 0;
        }
        .info {
            h4 {
                color: @gray-light;
            }
            .address-desc {
                color: @gray-light;
            }
        }
        &.active {
            color: @gray-dark;
            .info {
                h4 {
                    color: @gray-dark;
                }
                .address-desc {
                    color: @gray-dark;
                }
            }
        }
        .no-prompt{
            .set-line-height(1;.96rem;);
            color: #ff8000;
            font-size:.24rem;
            margin-left: .2rem;
            .border-top(@gray-dark-border);
        }
        
    }
</style>