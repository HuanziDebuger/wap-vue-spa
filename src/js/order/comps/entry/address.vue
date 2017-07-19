/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 12:30:43 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-27 14:35:42
 */
<template>
    <!--地址模块-->
    <router-link :to="nextPage">
        <div class="address-module" >
            <div class="mark-content">
                <div class="mark-tag"><span class="tag" :class="{'disabled': !($store.state.data.logisticsGoodsInfo && $store.state.data.logisticsGoodsInfo.goodsList && $store.state.data.logisticsGoodsInfo.goodsList.length>0 )}">配送地址</span></div>
                
            </div>
            <div class="address-cont" :class="{'active': $store.state.data.logisticsGoodsInfo && $store.state.data.logisticsGoodsInfo.goodsList && $store.state.data.logisticsGoodsInfo.goodsList.length>0 }">
                <div v-if='$store.state.data.address' class="info">
                    <h4>
                        <span class="name" >{{$store.state.data.address.name}}</span>
                        <span class="tel">{{$store.state.data.address.mobile }}</span>
                    </h4>
                    <p class="address-desc">
                        <span class="ui tag" v-if="$store.state.data.address.isDefault=='true'"><slot>默认</slot></span>
                        {{address}}</p>
                </div>
                <div v-else class="mid" ><span class="add-icon"></span><em>请先填写收货地址</em></div>
                <i class="link-ico"></i>
            </div>
        </div>
    </router-link>
</template>
<script>
    import Vue from 'vue';
    import {Root} from 'gome-ui-kit';
    import http from 'gome-utils-http'
    
    export default Vue.extend({
        computed: {
            address () {
                if(this.$store.state.data.address){
                    return this.$store.state.data.address.provinceName
                        + this.$store.state.data.address.cityName
                        + this.$store.state.data.address.districtName
                        + this.$store.state.data.address.townName
                        + this.$store.state.data.address.address
                }else{
                    return ''
                }
               
            },
            
            nextPage () {
                if(this.$store.state.data.address){
                    return '/address' 
                }else{
                    return '/address/add' 
                }
            }
        },
        created () {
        }
    });
</script>
<style lang='less'>
    @import '../../less/order.less';
    .address-module{
        background: url(../../images/bg.png) top repeat-x #fff;
        background-size: .99rem auto;
        padding-top: .2rem;
        .mark-content{
            .hor_padding();
            .flexbox();
            .flexbox.v_center;
            .mark-tag{
                .layout.flex1;
                .tag{
                    .set-line-height(1;.28rem;);
                    background-color: @red;
                    color: @white;
                    padding: 0 .04rem;
                    font-size:@font-nm-sm - .02rem;
                    border-radius: .04rem;
                    &.disabled{
                        background-color: #ddd; 
                    }
                }
            }
            
        }
        .option {
            margin:.26rem 0 0 .2rem;
            display: inline-block;
            .border-nm(#ddd);
            border-radius: 2rem;
            .set-line-height(1;.44rem;);
            min-width: 1.32rem;
            color: @gray-dark;
            .hor_padding();
            .boxSizing();
            text-align: center;
            &.active{
                // .border-nm(@red);
                // color: @red;
                // background: url("../../images/ico_check.png") no-repeat;
                // background-size: .33rem .32rem;
            };
        }
    }
    .address-cont{
        .flexbox();
        .flexbox.v_center;
        margin-left:.2rem;
        .boxSizing();
        min-height: 1.2rem;
        position: relative;
        padding: 0.14rem 0;
        padding-right:.2rem;
        font-size: .8rem;
        
        .info{
            .layout.flex1;
            h4{
                //color: @gray-dark;
                color: @gray-light;
                font-size: @font-title;
                margin-bottom: 0.1rem;
                .name{
                    display: inline-block;
                    margin-right: .4rem;
                };
                .tel{
                    display: @inlineBlock;
                }
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
                    .tag{
                        color: @red;
                        .border-nm(@red);
                    }
                }
            }
        }
    }
    .address-desc{
        font-size: @font-dark;
        word-break: break-all;
        //color: @gray-dark;
        color: @gray-light;
        line-height: .3rem;
        .tag{
            display: @inlineBlock;
            .boxSizing();
            font-size: @font-sm;
            //color: @red;
            color: @gray-light;
            .padding(0.1rem;.03rem; 0.1rem; .03rem);
            border-radius: .04rem;
            //.border-nm(@red);
            .border-nm(@gray-light);
            line-height: 0.05rem;
            margin-right: 0.03rem;

        }
    }
    .address-cont{
        .mid {
            
            .flexitem(1);
            .flexbox();
            .flexbox.v_center;
           
            line-height: 0;
            font-size: @font-dark;
            word-break: break-all;
            color: @gray-dark;
            .add-icon{
                display:@inlineBlock;
                .set-width-height(1;.4rem;);
                .background-image-nm(url(../../images/icon_add.png));
                margin-right:.12rem;
            }
            em{
                .layout.flex1;
            }
        }
    }
</style>