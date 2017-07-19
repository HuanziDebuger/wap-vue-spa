/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 12:30:45 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-02-17 15:53:56
 */
<template id="list">
    <ul class="list goods-info-list">
        <li>
            <router-link to="/pay">
                <label>支付方式</label>
                <div class="info pay-info">
                    <p class="payway-sel">{{$store.state.data.paymentMethodDesc }}</p>
                </div>
                <i class="link-ico"></i>
            </router-link>
        </li>
        <li>
            <router-link to="/invoice">
                <label>发票信息</label>
                <div class="info invo-info" >
                    <div v-if="$store.state.data.invoiceUnionInfo.invoiceType">
                        <p>{{$store.state.data.invoiceUnionInfo.invoiceType}}</p>
                        <p>{{$store.state.data.invoiceUnionInfo.invoiceHead}}</p>
                        <p>{{$store.state.data.invoiceUnionInfo.invoiceContext}}</p>
                    </div>
                    <p v-else>{{$store.state.data.invoiceUnionInfo.onInviceDesc}}</p>
                </div>
                <i class="link-ico" v-if=" $store.state.data.invoiceUnionInfo.allowUpdate !=='N'"></i>
            </router-link>
        </li>
    </ul>
</template>
<script>
    import Vue from 'vue';
    import {Button} from 'gome-ui-kit';
</script>
<style lang='less'>
    @import '../../less/order.less';
    .list{
        background-color: @white;
        padding-left: @font-sm;
        .module();
        margin-top: @font-sm;
    }
    .goods-info-list li{
        overflow: hidden;
        padding: @list-padding .2rem @list-padding 0;
        .text-right();
        .border-bot(@gray-dark-border);
        a{
            .flexbox();
            .flexbox.v_center;
        }
        label{
            .flexbox();
            .flexbox.v_center;
            margin-right: .56rem;
            font-size: @font-sm * 1.3;
            color: @gray-dark;
        }
        .info{
            .layout.flex1;
            .set-ellipsis();
            font-size: @font-dark;
            color: @gray-dark;
            p{
                .set-ellipsis();
                line-height: .32rem;
            }

        }
        &:last-child{
            border-bottom: none;
        };
    }

</style>