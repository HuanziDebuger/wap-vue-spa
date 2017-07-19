<template >
    <div class="list logisticsGoods-list" v-if="$store.state.data.logisticsGoodsInfo && $store.state.data.logisticsGoodsInfo.goodsList && $store.state.data.logisticsGoodsInfo.goodsList.length>0">
        
        <div class="goods-list" v-if="$store.state.data.logisticsGoodsInfo.goodsList">
            <div class="list-cont">
                <div class="img-box">
                    <img v-if="index<3" v-for="(imgs,index) in $store.state.data.logisticsGoodsInfo.goodsList" v-bind:src="'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='" v-lazyload="imgs.skuThumbImgUrl">
                    <div class="more_point" v-if="$store.state.data.logisticsGoodsInfo.goodsList.length>3"><span></span><span></span><span></span>
                    </div>
                </div>
                
                <div class="name" v-if="$store.state.data.logisticsGoodsInfo.goodsList.length==1">
                    <p class="desc">{{$store.state.data.logisticsGoodsInfo.goodsList[0].skuName}}</p>
                    <!--<p class="th-reason"><img class="th_ico" src="../../images/icon_7.png">不支持7天无理由退换货</p> -->
                </div>
                <div class="detail" v-if="$store.state.data.logisticsGoodsInfo.goodsList.length==1">
                    <p class="price">&yen;{{$store.state.data.logisticsGoodsInfo.goodsList[0].originalPrice}}</p>
                    <p class="num">x{{$store.state.data.logisticsGoodsInfo.goodCounts}}</p>
                </div>
            </div>
            <p class="all-num" v-if="$store.state.data.logisticsGoodsInfo.goodsList.length>1">共{{$store.state.data.logisticsGoodsInfo.goodCounts }}件</p>
            <i class="link-ico"></i>
        </div>
        <div class="desc-cont">
            <p class="pay-desc">{{$store.state.data.logisticsGoodsInfo.distributionDesc}}</p>
           
        </div>
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import Lazyload from 'gome-ui-lazyload';
    export default Vue.extend({
        components: {
        },
        data(){
            return{
                //GoodsList: this.$store.state.data.logisticsGoodsInfo.splice(0,3),
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
        background-color: @white;
        .desc-cont{
            padding: .2rem @font-sm .2rem 0 ;
            height: .76rem;
            color: #ff8000;
            //.border-top(@gray-dark-border);
            .flexbox.v_center;
            .pay-desc{
                font-size: @font-nm-sm + .02rem;
                //color: @gray;
                color: #ff8000;
                
                // line-height:.76rem;
            }
            .gray-desc{
                margin-top:.08rem;
                font-size:.22rem;
                color:#a2a4a6;
            }
        }
        .goods-list {
            margin-top:0; 
            .border-top(@gray-dark-border);
            padding: .2rem @font-sm @font-sm 0;
        }
    } 
    .goods-list{
        .flexbox();
        .flexbox.v_center;
        margin-top:.16rem;
        .list-cont{
            .layout.flex1;
            overflow: hidden;
            .flexbox();
            .flexbox.v_center;
            .img-box img{
                float: left;
                width: 0.98rem;
                margin-right: 0.18rem;
            }
        }
    } 
    .goods-list .list-cont{
        .name{
            .layout.flex1;
            color:@gray-light;
            font-size: @font-dark;
            .desc{
                .set-ellipsis-line(2);
                line-height:@font-lg-sm;
            }
        }
        .detail{
            float: right;
            margin: .2rem 0 0 .2rem;
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
                width:.28rem;
                margin-right: 0.04rem
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
            background: #999;
            margin: 0 .06rem;
            border-radius: .04rem;
        }
    }

</style>