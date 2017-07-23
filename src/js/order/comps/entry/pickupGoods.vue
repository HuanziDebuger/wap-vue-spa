<template >
    <div class="list logisticsGoods-list store-list" v-if="$store.state.data.pickupGoodsInfo ">
        
        <div class="goods-list" v-if="$store.state.data.pickupGoodsInfo.goodsList && $store.state.data.pickupGoodsInfo.goodsList.length>0">
            <div class="list-cont">
                <div class="img-box">
                    <CImage v-if="index < 3" v-for="(imgs,index) in $store.state.data.pickupGoodsInfo.goodsList"  :src="imgs.skuThumbImgUrl"></CImage>
                    <div class="more_point" v-if="$store.state.data.pickupGoodsInfo.goodsList.length>3"><span></span><span></span><span></span>
                    </div>
                </div>
                <div class="name" v-if="$store.state.data.pickupGoodsInfo.goodsList.length==1">
                    <p class="desc">{{$store.state.data.pickupGoodsInfo.goodsList[0].skuName}}</p>
                    <!--<p class="th-reason"><img class="th_ico" src="../../images/icon_7.png">不支持7天无理由退换货</p> -->
                </div>
                <div class="detail" v-if="$store.state.data.pickupGoodsInfo.goodsList.length==1">
                    <p class="price">&yen;{{$store.state.data.pickupGoodsInfo.goodsList[0].originalPrice}}</p>
                    <p class="num">x{{$store.state.data.pickupGoodsInfo.goodCounts}}</p>
                </div>
            </div>
            <p class="all-num" v-if="$store.state.data.pickupGoodsInfo.goodsList.length>1">共{{$store.state.data.pickupGoodsInfo.goodCounts }}件</p>
            <i class="link-ico"></i>
        </div>
        <div class="desc-cont">
            <p class="pay-desc" v-if="$store.state.data.pickupGoodsInfo.distributionDesc">{{$store.state.data.pickupGoodsInfo.distributionDesc}}</p>
           
        </div>
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import Lazyload from 'gome-ui-lazyload';
	import {CImage} from 'gome-ui-kit'
    export default Vue.extend({
        components: {
			CImage,
        },
        data(){
            return{
                //GoodsList: this.$store.state.data.pickupGoodsInfo.splice(0,3),
            }
        },
        methods:{

        },
        created: function(){

        },
    });
</script>
<style lang='less'>
   @import '../../less/order.less';
    .logisticsGoods-list {
        margin-top: 0;
        // .desc-cont{
        //     .pay-desc{
        //         font-size: @font-nm-sm + .02rem;
        //         //color: @gray;
        //         color: #ff8000;
        //         line-height:.76rem;
        //     }
        //     .gray-desc{
        //         margin-top:.08rem;
        //         font-size: @font-nm-sm - .02rem;
        //         color: #a2a4a6;
        //     }
        // }
        &.store-list{
            .goods-list{
                border-top:0; 
            }
        }
            
    } 
    
    .goods-list .list-cont{
        .name{
            
        }
        .detail{
            float: right;
            margin: 0 0 0 @font-sm;
            .text-right();
            font-size: .23rem;
            color: @gray-dark;
            .price{
                color: @red;
                font-size: @font-dark;
            }
        
        }
        .th-reason {
            .flexbox();
            .flexbox.v_center;
            margin-top: 0.1rem;
            font-size: @font-sm;
            img {
                display: @inlineBlock;
                width: @font-nm;
                margin-right: 0.04rem;
            }
        }
    }
    .all-num{
        .flexbox();
        .flexbox.v_center;
        font-size: @font-dark;
        color: @gray-dark;
    }
    .more_point {
        float: left;
        overflow: hidden;
        margin-left:.06rem;
        margin-top: .5rem;
        span {
            float: left;
            width: .06rem;
            height: .06rem;
            background: @gray-light;
            margin: 0 .06rem;
            border-radius: .04rem;
        }
    }

</style>