<template>
    <div>
        <ul class="total-list">
            <li>
                <span>商品总计</span>
                <span class="money">&yen;{{$store.state.data.orderAmount}}</span>
                <span class="num">{{$store.state.data.orderProdCount}}件</span>
            </li>
            <li>
                <span>运费</span>
                <span class="money">+&yen;{{$store.state.data.freight}}</span>
            </li>
            <li v-if="$store.state.data.prepaidCardAomount>0">
                <span>美通卡</span>
                <span class="money">-&yen;{{$store.state.data.prepaidCardAomount}}</span>
            </li>
            <li v-if="$store.state.data.promDiscount>0">
                <span>促销优惠</span>
                <span class="money">-&yen;{{$store.state.data.promDiscount}}</span>
            </li>
            <li v-if="$store.state.data.usedTicketAmount>0">
                <span>使用优惠券</span>
                <span class="money">-&yen;{{$store.state.data.usedTicketAmount}}</span>
            </li>
            <li v-if="$store.state.data.payBalance>0">
                <span>使用国美币</span>
                <span class="money">-&yen;{{$store.state.data.payBalance}}</span>
            </li>
            <li v-if="$store.state.data.usedMybAmount>0">
                <span>使用美盈宝余额</span>
                <span class="money">-&yen;{{$store.state.data.usedMybAmount}}</span>
            </li>
            <li v-if="$store.state.data.availablePoint>0 && $store.state.data.isUseGomePoint=='Y'">
                <span>使用美豆</span>
                <span class="money">-&yen;{{$store.state.data.availablePoint}}</span>
            </li>
            <li v-if="$store.state.data.usedKeytAmount && $store.state.data.canUseKeyt=='Y' && $store.state.data.keytStatus=='1'">
                <span>使用美口令</span>
                <span class="money">-{{$store.state.data.usedKeytAmount}}</span>
            </li>
        </ul>
        
        
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import {Button} from 'gome-ui-kit';
    export default Vue.extend({
        components: {
            'btn': Button
        },
       
        /*data: {
            $store: {}
        },*/
        /*computed: {
            couponData () {
                return {
                    a: $store.a
                }
            }
        },*/
        created:function(){
            
        }
    });
</script>
<style lang='less'>
    @import '../../less/order.less';
    .total-list {
        background: @white;
        .module_padding();
        overflow: hidden;
        font-size: @font-dark;
    }

    .total-list li {
        .set-line-height(1;.44rem);
        overflow: hidden
    }

    .total-list li span:first-child {
        float: left;
        color: @gray-light;
    }

    .total-list li .num {
        float: right;
        margin-right: .44rem
    }

    .total-list li .money {
        float: right
    }
    .payment_info {
        margin: .2rem 0;
        padding: .17rem .22rem .17rem .28rem;
        height: 1.02rem;
        background-color:@white;
        label{
            font-size: @font-lg-sm;
            color: @gray-dark;
        };
        .int_bar{
            margin-left: .64rem;
            padding: .17rem .17rem .21rem .17rem;
            border: .02rem solid #d2d2d2;
            border-radius: 2px;
        }
        input{
            width:100%;
        }

    }

</style>